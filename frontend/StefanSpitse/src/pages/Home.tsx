import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BLOG_ENABLED } from '../libs/features'

const Home = () => {
  const homeRef = useRef<HTMLDivElement | null>(null)
  const aboutRef = useRef<HTMLElement | null>(null)
  const [aboutVisible, setAboutVisible] = useState(false)

  useEffect(() => {
    const node = aboutRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAboutVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.3 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const node = homeRef.current
    if (!node) return

    let frame = 0
    const update = (x: number, y: number) => {
      node.style.setProperty('--cursor-x', `${x}px`)
      node.style.setProperty('--cursor-y', `${y}px`)
    }

    update(window.innerWidth * 0.5, window.innerHeight * 0.4)

    const handleMove = (event: PointerEvent) => {
      if (frame) {
        cancelAnimationFrame(frame)
      }
      frame = requestAnimationFrame(() => {
        update(event.clientX, event.clientY)
      })
    }

    window.addEventListener('pointermove', handleMove)
    return () => {
      window.removeEventListener('pointermove', handleMove)
      if (frame) {
        cancelAnimationFrame(frame)
      }
    }
  }, [])

  return (
    <div className="home" ref={homeRef}>
      <div className="cursor-orb" aria-hidden="true" />
      <section className="hero">
        <div className="hero-visual" aria-hidden="true" />
        <div className="hero-content">
          <p className="hero-eyebrow">Stefan Spitse</p>
          <h1 className="hero-title">
            A backend engineer building high-clarity products with a focus on systems, detail, and
            impact.
          </h1>
          <div className="hero-actions">
            <Link to="/projects" className="button primary">
              My Projects
            </Link>
            {BLOG_ENABLED ? (
              <Link to="/blog" className="button text">
                Read my blog
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section
        ref={aboutRef}
        className={`section about-section reveal${aboutVisible ? ' is-visible' : ''}`}
      >
        <header className="section-header about-header">
          <p className="about-eyebrow">About</p>
          <h2>About me</h2>
          <p className="muted">
            A quick snapshot of who I am and the skills I bring to a team.
          </p>
        </header>

        <div className="grid cards reveal-grid about-grid">
          <article className="card about-lead">
            <p className="about-role">Computer Science Student · NHL Stenden</p>
            <h3>Stefan Spitse</h3>
            <p className="muted">
              My name is Stefan Spitse. I am a highly motivated student/software
              engineer with <span className="highlight">2 years of professional experience</span>.
            </p>
          </article>
          <article className="card">
            <h3>Core skills</h3>
            <ul className="skill-list" aria-label="Core skills">
              <li>Python</li>
              <li>Git</li>
              <li>Java</li>
              <li>C++</li>
              <li>PHP</li>
              <li>Linux</li>
              <li>SQL</li>
            </ul>

            <p className="muted">
              Look at my projects for examples of me using these technologies.
            </p>
          </article>
          <article className="card">
            <h3>Contact</h3>
            <ul className="contact-list" aria-label="Contact links">
              <li>
                <a href="https://github.com/StefanSpitse4pm" target="_blank" rel="noreferrer">
                  github.com/StefanSpitse4pm
                </a>
              </li>
              <li>
                <a href="https://linkedin.com/in/stefan-spitse" target="_blank" rel="noreferrer">
                  linkedin.com/in/stefan-spitse
                </a>
              </li>
              <li>
                <a href="mailto:Stefan.Spitse@student.nhlstenden.com">
                  Stefan.Spitse@student.nhlstenden.com
                </a>
              </li>
            </ul>
          </article>
        </div>

      </section>
    </div>
  )
}

export default Home
