import React from "react"

//Header
import Header from "./Header"


const Scooter = ({ token }) => {

  const metadata = [
    { key: 'full_name', value: token.user.user_metadata.full_name },
    { key: 'email', value: token.user.email }
  ];
  return (
    <div>
      <Header token={metadata} />
    </div>
  )
}

export default Scooter