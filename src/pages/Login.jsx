import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from '@/services/authService'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useLoading } from '@/contexts/LoadingContext'

export function Login({setIsLoggedIn }) {
  const navigate = useNavigate();
      const { setLoading } = useLoading();
  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    const formData = new FormData(e.target);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    }
    try {
      const res = await login(data);
      localStorage.setItem("token", res.token);
      toast.success('Đăng nhập thành công!');
      setIsLoggedIn(true);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập của bạn.');
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Đăng nhập bằng tài khoản của bạn</CardTitle>
          <CardDescription>
            Nhập email của bạn bên dưới để đăng nhập vào tài khoản
          </CardDescription>

        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent>

            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
            </div>

          </CardContent>
          <CardFooter className="flex-col gap-2 mt-6">
            <Button type="submit" className="w-full cursor-pointer">
              Đăng nhập
            </Button>

          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
