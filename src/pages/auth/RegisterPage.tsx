import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { register as registerApi } from '../../api/auth'
import { useAuthStore } from '../../store/authStore'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Chip from '../../components/ui/Chip'

const SKIN_TYPES = ['건성', '지성', '복합성', '민감성', '중성']

const schema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  email: z.string().email('유효한 이메일을 입력해주세요'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다'),
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const loginStore = useAuthStore((s) => s.login)
  const [skinType, setSkinType] = useState('')
  const [skinTypeError, setSkinTypeError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    if (!skinType) {
      setSkinTypeError('피부타입을 선택해주세요')
      return
    }
    const res = await registerApi(data.name, data.email, data.password, skinType)
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
          label="이름"
          placeholder="이름을 입력해주세요"
          error={errors.name?.message}
          {...register('name')}
        />
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

        <div>
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            피부타입
          </p>
          <div className="flex flex-wrap gap-2">
            {SKIN_TYPES.map((type) => (
              <Chip
                key={type}
                active={skinType === type}
                onClick={() => { setSkinType(type); setSkinTypeError('') }}
              >
                {type}
              </Chip>
            ))}
          </div>
          {skinTypeError && <p className="mt-1 text-xs text-red-500">{skinTypeError}</p>}
        </div>

        <Button type="submit" fullWidth loading={isSubmitting}>
          회원가입
        </Button>
      </form>

      <p className="mt-6 text-sm text-gray-500">
        이미 계정이 있으신가요?{' '}
        <a href="/login" className="text-primary font-medium">로그인</a>
      </p>
    </div>
  )
}
