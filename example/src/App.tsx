import React from 'react'
import { Gallery } from 'react-chromeless-gallery'
import 'react-chromeless-gallery/dist/index.css'

import styles from './App.module.css'

const imageUrls = [
  'https://source.unsplash.com/F-gfrzSIPZo/1600x900',
  'https://source.unsplash.com/f68m3uHNT_A/1600x1600',
  'https://source.unsplash.com/xsIOCYmlI1g/900x1600',
  'https://source.unsplash.com/KMn4VEeEPR8/1600x1200',
  'https://source.unsplash.com/6ArTTluciuA/1200x1600'
]

const App = () => (
  <div className={styles.App}>
    <h2>1</h2>
    <Gallery>
      {imageUrls.map((url) => (
        <img
          key={url}
          className={styles.App_ImageItem}
          src={url}
          alt=''
          style={{ display: 'block', width: '100%' }}
          draggable={false}
        />
      ))}
    </Gallery>
    <h2>2</h2>
    <Gallery>
      {imageUrls.map((url) => (
        <a
          key={url}
          className={styles.App_AnchorItem}
          href={url}
          target='_blank'
          rel='noopener noreferrer'
          draggable={false}
        >
          <img src={url} alt='' draggable={false} />
        </a>
      ))}
    </Gallery>
  </div>
)

export default App
