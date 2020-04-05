import React from 'react'
import styles from './index.module.scss'

export default function Field({ label, value }) {

  return (
    <div className={styles.field}>
      <p>{label}</p>
      <div className="spacer" />
      <p><b>{value}</b></p>
    </div>
  )
}
