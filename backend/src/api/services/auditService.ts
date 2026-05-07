import pool from '../../utils/db';
import { logger } from '../../utils/logger';
import puppeteer, { Browser } from 'puppeteer';
import axios from 'axios';

export class AuditService {
  private browser: Browser | null = null;

  async queueAudit(auditId: string, websiteId: string) {
    try {
      await pool.query(
        `UPDATE audits SET status = 'running' WHERE id = $1`,
        [auditId]
      );

      const websiteResult = await pool.query(
        `SELECT * FROM websites WHERE id = $1`,
        [websiteId]
      );

      if (websiteResult.rows.length === 0) {
        throw new Error('Website not found');
      }

      const website = websiteResult.rows[0];

      // Run audit checks
      const issues = await this.performAudit(website.domain);

      // Save issues
      for (const issue of issues) {
        await pool.query(
          `INSERT INTO audit_issues (audit_id, type, category, title, description, 
           recommendation, how_to_fix, affected_pages, priority, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
          [auditId, issue.type, issue.category, issue.title, issue.description,
           issue.recommendation, issue.howToFix, issue.affectedPages, issue.priority]
        );
      }

      // Update audit status
      await pool.query(
        `UPDATE audits SET status = 'completed', completed_at = NOW() WHERE id = $1`,
        [auditId]
      );

      logger.info(`Audit ${auditId} completed with ${issues.length} issues`);
    } catch (err) {
      logger.error('Audit error:', err);
      await pool.query(
        `UPDATE audits SET status = 'failed' WHERE id = $1`,
        [auditId]
      );
    }
  }

  private async performAudit(domain: string): Promise<any[]> {
    const issues: any[] = [];

    // Initialize browser if not already done
    if (!this.browser) {
      this.browser = await puppeteer.launch({ headless: 'new' });
    }

    try {
      const page = await this.browser.newPage();
      await page.goto(domain, { waitUntil: 'networkidle2' });

      // Meta tags audit
      const metaIssues = await this.auditMetaTags(page, domain);
      issues.push(...metaIssues);

      // Performance audit
      const perfIssues = await this.auditPerformance(page, domain);
      issues.push(...perfIssues);

      // SSL/Security audit
      const securityIssues = await this.auditSecurity(page, domain);
      issues.push(...securityIssues);

      // Sitemap and robots.txt audit
      const technicalIssues = await this.auditTechnical(domain);
      issues.push(...technicalIssues);

      // Mobile audit
      const mobileIssues = await this.auditMobile(page, domain);
      issues.push(...mobileIssues);

      await page.close();
    } catch (err) {
      logger.error('Audit performance error:', err);
    }

    return issues;
  }

  private async auditMetaTags(page: any, domain: string): Promise<any[]> {
    const issues: any[] = [];

    try {
      const title = await page.title();
      const metaDescription = await page.$eval(
        'meta[name="description"]',
        el => el.getAttribute('content')
      ).catch(() => null);

      if (!title || title.length === 0) {
        issues.push({
          type: 'critical',
          category: 'Meta Tags',
          title: 'Missing page title',
          description: 'Page title is missing or empty',
          recommendation: 'Add a descriptive title tag (50-60 characters)',
          howToFix: 'Add <title>Your Page Title</title> to <head> section',
          affectedPages: 1,
          priority: 10
        });
      } else if (title.length > 70) {
        issues.push({
          type: 'warning',
          category: 'Meta Tags',
          title: 'Title tag too long',
          description: `Title is ${title.length} characters (recommended: 50-70)`,
          recommendation: 'Keep title under 70 characters',
          howToFix: `Shorten the title to be more concise: "${title.substring(0, 60)}..."`,
          affectedPages: 1,
          priority: 7
        });
      }

      if (!metaDescription) {
        issues.push({
          type: 'critical',
          category: 'Meta Tags',
          title: 'Missing meta description',
          description: 'Meta description tag is missing',
          recommendation: 'Add a compelling meta description (150-160 characters)',
          howToFix: 'Add <meta name="description" content="..."> to <head> section',
          affectedPages: 1,
          priority: 10
        });
      }
    } catch (err) {
      logger.error('Meta tags audit error:', err);
    }

    return issues;
  }

  private async auditPerformance(page: any, domain: string): Promise<any[]> {
    const issues: any[] = [];

    try {
      const metrics = await page.metrics();

      if (metrics.JSHeapUsedSize > 50000000) {
        issues.push({
          type: 'warning',
          category: 'Performance',
          title: 'High JavaScript memory usage',
          description: 'Page uses excessive JavaScript memory',
          recommendation: 'Minimize JavaScript bundle size and remove unused code',
          howToFix: 'Use code splitting, tree shaking, and lazy loading techniques',
          affectedPages: 1,
          priority: 6
        });
      }
    } catch (err) {
      logger.error('Performance audit error:', err);
    }

    return issues;
  }

  private async auditSecurity(page: any, domain: string): Promise<any[]> {
    const issues: any[] = [];

    try {
      const https = domain.startsWith('https');
      if (!https) {
        issues.push({
          type: 'critical',
          category: 'Security',
          title: 'Not using HTTPS',
          description: 'Website is not served over HTTPS',
          recommendation: 'Install SSL certificate and redirect all traffic to HTTPS',
          howToFix: 'Get a free SSL certificate from Let\'s Encrypt and configure your server',
          affectedPages: -1,
          priority: 10
        });
      }
    } catch (err) {
      logger.error('Security audit error:', err);
    }

    return issues;
  }

  private async auditTechnical(domain: string): Promise<any[]> {
    const issues: any[] = [];

    try {
      // Check robots.txt
      const robotsUrl = `${domain}/robots.txt`;
      const robotsResponse = await axios.get(robotsUrl).catch(() => null);

      if (!robotsResponse) {
        issues.push({
          type: 'info',
          category: 'Technical SEO',
          title: 'Missing robots.txt',
          description: 'robots.txt file is not found',
          recommendation: 'Create a robots.txt file to guide search engine crawlers',
          howToFix: 'Create /robots.txt with User-agent and Disallow rules',
          affectedPages: 1,
          priority: 4
        });
      }

      // Check sitemap
      const sitemapUrl = `${domain}/sitemap.xml`;
      const sitemapResponse = await axios.get(sitemapUrl).catch(() => null);

      if (!sitemapResponse) {
        issues.push({
          type: 'warning',
          category: 'Technical SEO',
          title: 'Missing sitemap.xml',
          description: 'sitemap.xml file is not found',
          recommendation: 'Create and submit an XML sitemap',
          howToFix: 'Generate sitemap.xml and submit to Google Search Console',
          affectedPages: 1,
          priority: 7
        });
      }
    } catch (err) {
      logger.error('Technical audit error:', err);
    }

    return issues;
  }

  private async auditMobile(page: any, domain: string): Promise<any[]> {
    const issues: any[] = [];

    try {
      const viewport = await page.evaluate(() => ({
        width: window.innerWidth,
        height: window.innerHeight
      }));

      const viewportMeta = await page.$eval(
        'meta[name="viewport"]',
        el => el.getAttribute('content')
      ).catch(() => null);

      if (!viewportMeta) {
        issues.push({
          type: 'critical',
          category: 'Mobile',
          title: 'Missing viewport meta tag',
          description: 'Viewport meta tag is not configured',
          recommendation: 'Add viewport meta tag for responsive design',
          howToFix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to <head>',
          affectedPages: 1,
          priority: 10
        });
      }
    } catch (err) {
      logger.error('Mobile audit error:', err);
    }

    return issues;
  }
}
