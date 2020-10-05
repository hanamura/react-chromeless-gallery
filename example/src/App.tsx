import React from 'react'
import {
  Gallery,
  GalleryProvider,
  GalleryConsumer
} from 'react-chromeless-gallery'
import 'react-chromeless-gallery/dist/index.css'

import styles from './App.module.css'

const imageUrls = [
  'https://source.unsplash.com/F-gfrzSIPZo/1600x900',
  'https://source.unsplash.com/f68m3uHNT_A/1600x900',
  'https://source.unsplash.com/xsIOCYmlI1g/1600x900',
  'https://source.unsplash.com/KMn4VEeEPR8/1600x900',
  'https://source.unsplash.com/6ArTTluciuA/1600x900'
]

const imageUrlsVariousAspectRatio = [
  'https://source.unsplash.com/F-gfrzSIPZo/1600x900',
  'https://source.unsplash.com/f68m3uHNT_A/1600x1200',
  'https://source.unsplash.com/xsIOCYmlI1g/1600x1600',
  'https://source.unsplash.com/KMn4VEeEPR8/1600x700',
  'https://source.unsplash.com/6ArTTluciuA/1600x800'
]

const App = () => {
  return (
    <div className={styles.App}>
      <h2>Minimal</h2>
      <Gallery>
        {imageUrls.map((url) => (
          <img
            key={url}
            className={styles.App_ImageItem}
            src={url}
            alt=''
            draggable={false}
          />
        ))}
      </Gallery>

      <h2>With links</h2>
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

      <h2>Various height</h2>
      <Gallery>
        {imageUrlsVariousAspectRatio.map((url) => (
          <img
            key={url}
            className={styles.App_ImageItem}
            src={url}
            alt=''
            draggable={false}
          />
        ))}
      </Gallery>

      <h2>With controls</h2>
      <GalleryProvider>
        <Gallery>
          {imageUrls.map((url) => (
            <img
              key={url}
              className={styles.App_ImageItem}
              src={url}
              alt=''
              draggable={false}
            />
          ))}
        </Gallery>
        <GalleryConsumer>
          {({ index, length, to, prev, next, hasPrev, hasNext }) => (
            <div className={styles.App_Control}>
              <button
                className={styles.App_ControlPrev}
                onClick={prev}
                disabled={!hasPrev}
              />
              <ul>
                {new Array(length).fill(0).map((_, i) => (
                  <li key={i.toString()}>
                    <button
                      className={i === index ? styles.isActive : ''}
                      onClick={() => to(i)}
                    />
                  </li>
                ))}
              </ul>
              <button
                className={styles.App_ControlNext}
                onClick={next}
                disabled={!hasNext}
              />
            </div>
          )}
        </GalleryConsumer>
      </GalleryProvider>
    </div>
  )
}

export default App
