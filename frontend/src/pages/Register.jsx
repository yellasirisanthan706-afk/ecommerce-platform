import { useState } from 'react'
import { API_BASE_URL } from '../config.js'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setMessage('')

    if (!name || !email || !password || !confirmPassword) {
      setMessage('Please fill in all fields.')
      return
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(
          data.error || 'Registration failed.'
        )
        setLoading(false)
        return
      }

      setMessage(
        'Registration successful! Redirecting to login...'
      )

      setName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')

      setTimeout(() => {
        navigate('/login')
      }, 1000)
    } catch (error) {
      console.error(error)

      setMessage(
        'Unable to connect to the backend server.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <h1>Create Account</h1>

      <p>Register a new account.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <br />

          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Enter your name"
          />
        </div>

        <br />

        <div>
          <label>Email</label>
          <br />

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="Enter your email"
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Enter your password"
          />
        </div>

        <br />

        <div>
          <label>Confirm Password</label>
          <br />

          <input
            type="password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            placeholder="Confirm your password"
          />
        </div>

        <br />

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      {message && <p>{message}</p>}

      <p>
        Already have an account?{' '}
        <Link to="/login">
          Login
        </Link>
      </p>
    </main>
  )
}

export default Register
