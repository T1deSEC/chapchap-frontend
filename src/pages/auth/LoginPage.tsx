import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { login } from '../../api/auth'
import { useAuthStore } from '../../store/authStore'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const schema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const loginStore = useAuthStore((s) => s.login)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    const res = await login(data.email, data.password)
    loginStore(res.data.accessToken, res.data.user)
    navigate('/home')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 bg-background-light dark:bg-background-dark">
      <div className="flex items-center gap-1.5 mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          strokeWidth="2" stroke="#135bec" width="32" height="32">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 2.25c3.5 3.75 7.5 7.25 7.5 11.25A7.5 7.5 0 1 1 4.5 13.5c0-4 4-7.5 7.5-11.25z" />
        </svg>
        <span className="text-xl font-bold text-gray-900 dark:text-white">CHAPCHAP</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-sm space-y-4">
        <Input
          label="이메일"
          type="email"
          placeholder="이메일을 입력해주세요"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" fullWidth loading={isSubmitting}>
          로그인
        </Button>
      </form>

      <p className="mt-6 text-sm text-gray-500">
        계정이 없으신가요?{' '}
        <a href="/register" className="text-primary font-medium">회원가입</a>
      </p>

      {import.meta.env.DEV && (
        <button
          type="button"
          onClick={() => {
            loginStore('dev-token', {
              id: 1,
              name: '개발자',
              email: 'dev@chapchap.com',
              skinType: '복합성',
            })
            navigate('/home')
          }}
          className="mt-8 text-xs text-gray-400 underline"
        >
          [개발용] 백엔드 없이 로그인
        </button>
      )}
    </div>
  )
}
