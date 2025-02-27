import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { Button } from "@/components/ui/button"
import { AtSign, Facebook, Github, Lock, Twitter, ChromeIcon as Google } from 'lucide-react';
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import ChatImage from "../../public/Chat-rafiki.svg"

function Login() {
  return (
    <div className="flex pt-40 justify-center ">
      <Card className="w-full max-w-4xl flex overflow-hidden rounded-lg">
        <div className="bg-gradient-to-b from-primary to-blue-900 text-primary-foreground p-8 flex flex-col justify-center w-1/2">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-center">Bem-vindo!</h2>
            <p className="mb-6 text-center">
              Estamos felizes em te ver aqui. Faça login para acessar sua conta ou crie uma nova se ainda não tiver.
            </p>
          </div>
          <Button variant="secondary" asChild className="w-full">
            <Link to="/register">Crie aqui</Link>
          </Button>
        </div>
        <div className="w-1/2 p-8">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Entrar</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="pl-10" // Adiciona padding à esquerda
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  className="pl-10" // Adiciona padding à esquerda
                />
              </div>
              <div>
                <Button asChild variant="link" className="text-sm p-0 h-auto text-muted-foreground">
                  <Link to="/recuperar">Esqueceu-se da palavra-passe?</Link>
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="grid gap-4">
            <Button className="w-full">Entrar</Button>
            <Separator className="my-4" />
            <p className="text-center text-sm text-gray-500 mb-4">Ou continue com</p>
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button variant="outline" >
                <Google className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button variant="outline">
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
              <Button variant="outline">
                <Twitter className="mr-2 h-4 w-4"/>
                Twitter
              </Button>
              <Button variant="outline">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>
          </CardFooter>
        </div>
      </Card>
    </div>
  )
}

export default Login
