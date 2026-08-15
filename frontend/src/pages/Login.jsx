import { useState } from 'react'

function Login({
  isLoggedIn,
  onLogin,
  onLogout,
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setMessage('')

    if (!email || !password) {
      setMessage('Please enter email and password.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        'http://localhost:5000/api/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(
          data.error || 'Login failed.'
        )
        return
      }

      // Save logged-in user information
      localStorage.setItem(
        'userEmail',
        data.user.email
      )

      localStorage.setItem(
        'userName',
        data.user.name
      )

      localStorage.setItem(
        'userId',
        String(data.user.id)
      )

      // Save user role
      localStorage.setItem(
        'userRole',
        data.user.role
      )

      setMessage('Login successful!')

      onLogin(data.user.email)

    } catch (error) {
      console.error(error)

      setMessage(
        'Unable to connect to the backend server.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (isLoggedIn) {
    const userEmail =
      localStorage.getItem('userEmail')

    const userName =
      localStorage.getItem('userName')

    const userRole =
      localStorage.getItem('userRole')

    return (
      <main>
        <h1>Welcome!</h1>

        <p>
          Hello {userName}
        </p>

        <p>
          You are logged in as {userEmail}
        </p>

        <p>
          Role: {userRole}
        </p>

        <button
          type="button"
          onClick={onLogout}
        >
          Logout
        </button>
      </main>
    )
  }

  return (
    <main>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
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

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Logging in...'
            : 'Login'}
        </button>
      </form>

      {message && <p>{message}</p>}
    </main>
  )
}

export default Login