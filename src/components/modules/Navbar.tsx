"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { signIn, signOut } from "next-auth/react";

type NavbarProps = {
  isLogged: boolean;
};

export default function Navbar({ isLogged }: NavbarProps) {
  return (
    <NavigationMenu className="w-full max-w-full justify-end py-5 px-5">
      <NavigationMenuList>
        {isLogged ? (
          <>
            <NavigationMenuItem>
              <Link href="/projects" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Projects
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button onClick={() => signOut({ callbackUrl: "/" })}>
                SignOut
              </Button>
            </NavigationMenuItem>
          </>
        ) : (
          <NavigationMenuItem>
            <Button onClick={() => signIn()}>SignIn</Button>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
