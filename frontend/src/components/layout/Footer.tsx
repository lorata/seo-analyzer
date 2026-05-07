'use client'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg text-dark mb-4">SEO Analyzer Pro</h3>
            <p className="text-gray-600 text-sm">Professional SEO analysis tool for optimizing websites</p>
          </div>
          <div>
            <h4 className="font-semibold text-dark mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-primary">Features</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Pricing</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Documentation</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-dark mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-primary">About</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-dark mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-primary">Privacy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8 flex justify-between items-center">
          <p className="text-gray-600 text-sm">&copy; 2026 SEO Analyzer Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
