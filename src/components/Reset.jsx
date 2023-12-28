/* eslint-disable no-unused-vars */
import styles from '../styles/Username.module.css';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { Navigate, useNavigate } from 'react-router-dom';
import { resetPasswordValidation } from '../helper/validate.js'
import { resetPassword } from '../helper/helper.js';
import { useAuthStore } from '../store/store.js';
import useFetch from '../hooks/fetch.hook.js';
import { useEffect } from 'react';

const Reset = () => {
  const navigate = useNavigate();
  const { username } = useAuthStore(state => state.auth);
  const [{ isLoading, apiData, status, serverError }] = useFetch('createResetSession');

  useEffect(() => {
    console.log(apiData);
  });

  const formik = useFormik({
    initialValues: {
      password: '',
      confirm_pwd: ''
    },
    validate: resetPasswordValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      let resetPromise = resetPassword({ username, password: values.password });

      toast.promise(resetPromise, {
        loading: 'Updating...',
        success: <b>Reset Successfully...!</b>,
        error: <b>Could not Reset!</b>
      });

      resetPromise.then(function () { navigate('/password') });
    }
  });

  if (isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
  if (serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>
  if (status && status !== 201) return <Navigate to={'/password'} replace={true}></Navigate>

  return (
    <div className="container mx-auto">
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass} style={{ width: "35%" }}>

          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold text-[#ff6a6a]'>Reset Password!</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Enter new password.
            </span>
          </div>

          <form className='py-20' onSubmit={formik.handleSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('password')} className={styles.text_box}
                type="password" placeholder='New Password' />
              <input {...formik.getFieldProps('confirm_pwd')} className={styles.text_box}
                type="password" placeholder='Repeat Password' />
              <button className={`${styles.btn} bg-indigo-500`} type='submit'>Reset</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Reset;