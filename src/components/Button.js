import React from 'react'

const Button = (props) => {
    return (
        <div className="button" onClick={props.onClick}>
            {props.country}
        </div>
    )
}

export default Button








