/* eslint-disable no-unused-vars */
import styles from '../styles/Username.module.css';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from '../store/store.js';
import { generateOTP, verifyOTP } from '../helper/helper';

const Recovery = () => {
  const navigate = useNavigate();
  const [OTP, setOTP] = useState();
  const { username } = useAuthStore(state => state.auth);

  useEffect(() => {
    generateOTP(username).then((OTP) => {
      if (OTP) return toast.success('OTP has been send to your email!');
      return toast.error('Problem while generating OTP!')
    })
  }, [username]);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      let { status } = await verifyOTP({ username, code: OTP })
      if (status === 201) {
        toast.success('Verify Successfully!')
        return navigate('/reset')
      }
    } catch (error) {
      return toast.error('Wrong OTP! Check email again!')
    }
  }

  //** handler of resend OTP */
  function resendOTP() {
    let sentPromise = generateOTP(username);

    toast.promise(sentPromise, {
      loading: 'Sending...',
      success: <b>OTP has been send to your email!</b>,
      error: <b>Could not Send it!</b>,
    });

    sentPromise.then((OTP) => {
      console.log(OTP)
    });
  }

  return (
    <div className="container mx-auto">
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold text-[#ff6a6a]'>Recover Password!</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Enter OTP to recover password.
            </span>
          </div>

          <form className='pt-20' onSubmit={onSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <div className="input text-center">
                <span className='py-4 text-sm text-left text-gray-500'>
                  Enter 6 digit OTP sent to your email address.
                </span>
                <input id='recover-password' onChange={(e) => setOTP(e.target.value)} className={`mt-10 ${styles.text_box}`} type="text" placeholder='OTP' autoComplete='off' />
              </div>
              <button className={`${styles.btn} bg-indigo-500`} type='submit'>Recover</button>
            </div>
          </form>
          <div className="text-center py-4">
            <span className='text-gray-500'>
              Can&apos;t get OTP? <button onClick={resendOTP} className='text-red-500'>Resend</button>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Recovery;