import { useState, useEffect } from 'react'
import logo from './logo.svg'
import './App.css'
 
function App() {
  const [count, setCount] = useState(0)
  function getHello() {
    const greet = document.getElementById('greet')
    fetch(import.meta.env.VITE_API_SERVER + '/api/hello')
      .then(response => response.json())
      .then(data => greet.innerHTML = JSON.stringify(data))
  }
  // Similar to componentDidMount and componentDidUpdate:
  useEffect(getHello)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Car Information Center</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          api call check: <code id="greet"></code>
        </p>
      </header>
    </div>
  )
}

export default App
