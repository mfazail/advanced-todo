import { ModeToggle } from '@/components/mode-toggle'
const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-background flex items-center justify-between px-4 py-2 border border-border">
        <h1 className="text-xl font-bold">A. Todo</h1>
        <ModeToggle />
    </nav>
  )
}

export default Navbar