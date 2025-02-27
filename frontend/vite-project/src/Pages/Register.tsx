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
import { AtSign, Lock,} from 'lucide-react';
import { Link } from "react-router-dom";
import { UserRound } from 'lucide-react';
import { IdCard } from 'lucide-react';

function Register() {
  return (
    <div className="flex pt-40 justify-center ">
      <Card className="w-full max-w-4xl flex overflow-hidden rounded-lg">
        <div className="bg-gradient-to-b from-primary to-blue-900 text-primary-foreground p-8 flex flex-col justify-center w-1/2">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-center">Bem-vindo!</h2>
            <p className="mb-6 text-center">
              Estamos felizes em te ver aqui. Crie a sua conta ou entre se já tiver uma.
            </p>
          </div>
          <Button asChild variant="secondary" className="w-full">
            <Link to="/login">Entre</Link>
          </Button>
        </div>
        <div className="w-1/2 p-8">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Criar</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Nome</Label>
              <div className="relative">
                <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Nome"
                  className="pl-10" // Adiciona padding à esquerda
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Username</Label>
              <div className="relative">
                <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Username"
                  className="pl-10" // Adiciona padding à esquerda
                />
              </div>
            </div>
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
            </div>
          </CardContent>
          <CardFooter className="grid gap-4">
            <Button className="w-full">Criar</Button>
          </CardFooter>
        </div>
      </Card>
    </div>
  )
}

export default Register
