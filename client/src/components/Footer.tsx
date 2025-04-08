export default function Footer() {
  return (
    <footer className="py-6 px-4 text-center text-secondary text-sm">
      <div className="flex justify-center space-x-6 mb-2">
        <a href="#" className="hover:text-accent transition-colors">About</a>
        <a href="#" className="hover:text-accent transition-colors">Support</a>
        <a href="#" className="hover:text-accent transition-colors">GitHub</a>
      </div>
      <p>© {new Date().getFullYear()} TypeMaster</p>
    </footer>
  );
}
