export default function Footer() {
  return (
    <footer className="py-6 px-4 text-center text-secondary text-sm border-t border-border/20">
      <div className="flex justify-center space-x-6 mb-2">
        <a href="#" className="hover:text-accent transition-colors custom-focus-ring rounded-sm px-1">About</a>
        <a href="#" className="hover:text-accent transition-colors custom-focus-ring rounded-sm px-1">Support</a>
        <a href="https://github.com/moah0911/TypeNinja" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors custom-focus-ring rounded-sm px-1">GitHub</a>
      </div>
      <p>© {new Date().getFullYear()} FlexType</p> {/* Changed TypeMaster to FlexType to match Header */}
    </footer>
  );
}
