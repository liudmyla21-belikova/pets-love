'use client';

import css from './RegisterForm.module.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';
import { register as registerUser } from '@/lib/api/serverApi';
import { useAuthStore } from '@/lib/store/AuthStore';
import Link from 'next/link';
import { useState } from 'react';

export const registrationSchema = yup.object({
  name: yup.string().required('Name is required'),

  email: yup
    .string()
    .required('Email is required')
    .matches(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Enter a valid Email'),

  password: yup
    .string()
    .required('Password is required')
    .min(7, 'Password must be at least 7 characters'),

  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

interface RegistrationFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [isPassword, setIsPassword] = useState(true);
  const [isConfirmPassword, setIsConfirmPassword] = useState(true);

  const togglePassword = () => setIsPassword(!isPassword);
  const toggleConfirmPassword = () => setIsConfirmPassword(!isConfirmPassword);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: yupResolver(registrationSchema),
  });
  const onSubmit = async (data: RegistrationFormData) => {
    try {
      const user = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (user) {
        setUser(user);
      }

      toast(`${user.name} logined successfuly`);

      router.push('/profile');
    } catch (error: any) {
      toast(error?.data?.message || 'Registration failed');
    }
  };

  const passwordValue = watch('password');

  return (
    <div className={css.box}>
      <Toaster />
      <form onSubmit={handleSubmit(onSubmit)} className={css.form}>
        <label className={css.label}>
          <input
            placeholder="Name"
            {...register('name')}
            className={`${css.input} ${errors.name ? css.inputError : ''}`}
          />
          {errors.name && <p style={{ color: '#ef2447' }}>{errors.name.message}</p>}
        </label>
        <label className={css.label}>
          <input
            placeholder="Email"
            {...register('email')}
            className={`${css.input} ${errors.email ? css.inputError : ''}`}
          />
          {errors.email && <p style={{ color: '#ef2447' }}>{errors.email.message}</p>}
        </label>
        <label className={css.label}>
          <input
            type={isPassword ? 'password' : 'text'}
            placeholder="Password"
            {...register('password')}
            className={`${css.input} ${errors.password ? css.inputError : ''}  ${!errors.password && passwordValue?.length >= 7 ? css.inputSuccess : ''}`}
          />
          {!isPassword && (
            <svg className={css.eye} width={18} height={18} onClick={togglePassword}>
              <use href="/symbol-defs.svg#eye-off" />
            </svg>
          )}
          {isPassword && (
            <svg className={css.eye} width={18} height={18} onClick={togglePassword}>
              <use href="/symbol-defs.svg#eye" />
            </svg>
          )}
          {errors.password && <p style={{ color: '#ef2447' }}>{errors.password.message}</p>}
          {!errors.password && passwordValue?.length >= 7 && (
            <p className={css.success}>Password is secure</p>
          )}
          {!errors.password && passwordValue?.length >= 7 && (
            <svg width={18} height={18} className={css.check}>
              <use href="/symbol-defs.svg#check" />
            </svg>
          )}
        </label>
        <label className={css.label}>
          <input
            type={isConfirmPassword ? 'password' : 'text'}
            placeholder="Confirm password"
            {...register('confirmPassword')}
            className={`${css.input} ${errors.confirmPassword ? css.inputError : ''}`}
          />
          {!isConfirmPassword && (
            <svg className={css.eye} width={18} height={18} onClick={toggleConfirmPassword}>
              <use href="/symbol-defs.svg#eye-off" />
            </svg>
          )}
          {isConfirmPassword && (
            <svg className={css.eye} width={18} height={18} onClick={toggleConfirmPassword}>
              <use href="/symbol-defs.svg#eye" />
            </svg>
          )}
          {errors.confirmPassword && (
            <p style={{ color: '#ef2447' }}>{errors.confirmPassword.message}</p>
          )}
        </label>

        <button type="submit" disabled={isSubmitting} className={css.btn}>
          REGISTRATION
        </button>
        <p className={css.text}>
          Already have an account?
          <Link href={'/login'} className={css.link}>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
