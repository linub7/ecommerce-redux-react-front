import React, { useEffect, useState } from 'react';
import { auth, googleAuthProvider } from '../../firebase';
import { toast } from 'react-toastify';
import { Button } from 'antd';
import { Spin, Space } from 'antd';
import { GoogleOutlined, MailOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createOrUpdateUser } from '../../functions/auth';

const Login = ({ history }) => {
  const [email, setEmail] = useState('linub7@gmail.com');
  const [password, setPassword] = useState('1234567');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const roleBasedRedirect = (res) => {
    // check if intended
    let intended = history.location.state;
    if (intended) {
      history.push(intended.from);
    } else {
      if (res.data.role === 'admin') {
        history.push('/admin/dashboard');
      } else {
        history.push('/user/history');
      }
    }
  };

  useEffect(() => {
    let intended = history.location.state;
    if (intended) {
      return;
    } else {
      if (user && user.token) {
        history.push('/');
      }
    }
  }, [user, history]);

  const googleLogin = async () => {
    auth
      .signInWithPopup(googleAuthProvider)
      .then(async (result) => {
        const { user } = result;
        const idTokenResult = await user.getIdTokenResult();
        createOrUpdateUser(idTokenResult.token)
          .then((response) => {
            dispatch({
              type: 'LOGGED_IN_USER',
              payload: {
                name: response.data.name,
                email: response.data.email,
                token: idTokenResult.token,
                role: response.data.role,
                _id: response.data._id,
              },
            });
            roleBasedRedirect(response);
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();

      createOrUpdateUser(idTokenResult.token)
        .then((response) => {
          dispatch({
            type: 'LOGGED_IN_USER',
            payload: {
              name: user.email.split('@')[0],
              email: response.data.email,
              token: idTokenResult.token,
              role: response.data.role,
              _id: response.data._id,
            },
          });
          roleBasedRedirect(response);
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <input
          type='email'
          className='form-control'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Your Email'
          required
          autoFocus
        />
      </div>
      <div className='form-group'>
        <input
          type='password'
          className='form-control'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Your Password'
          required
        />
      </div>
      <br />
      <Button
        onClick={handleSubmit}
        type='primary'
        className='mb-3'
        block
        shape='round'
        icon={<MailOutlined />}
        size='large'
        disabled={!email || password.length < 6}
      >
        Login With Email/Password
      </Button>
    </form>
  );

  return (
    <div className='container p-5'>
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          {!loading ? (
            <h4>Login</h4>
          ) : (
            <Space
              size='middle'
              style={{ position: 'absolute', right: '50%', top: '-10%' }}
            >
              <Spin size='large' />
            </Space>
          )}

          {loginForm()}

          <Button
            onClick={googleLogin}
            type='danger'
            className='mb-3'
            block
            shape='round'
            icon={<GoogleOutlined />}
            size='large'
          >
            Login With Google
          </Button>
          <Link to='/forgot/password' className='text-danger float-end'>
            Forgot Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
