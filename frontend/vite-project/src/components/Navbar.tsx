// components/Navbar.tsx
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { LogIn } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        {/* Desktop Nav */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="pl-20">
            <NavigationMenuItem>
              <Link to="/" className={`${navigationMenuTriggerStyle()} text-xl`}>
                Home
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/about" className={`${navigationMenuTriggerStyle()} text-xl`}>
                Sobre
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/contact" className={`${navigationMenuTriggerStyle()} text-xl`}>
                Contato
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="flex flex-col gap-2">
              <Link to="/" className={navigationMenuTriggerStyle()}>
                Home
              </Link>
              <Link to="/about" className={navigationMenuTriggerStyle()}>
                Sobre
              </Link>
              <Link to="/contact" className={navigationMenuTriggerStyle()}>
                Contato
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" asChild className="text-xl">
            <Link to="/login">Entrar<LogIn/></Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}