const About = () => {
  return (
    <section className="section">
      <header className="section-header">
        <h2>About me</h2>
        <p className="muted">Update this page with your story and focus.</p>
      </header>

      <div className="grid cards">
        <article className="card">
          <h3>Profile</h3>
          <p className="muted">
            Write a short bio here. Mention your role, specialties, and the
            industries or products you enjoy building.
          </p>
        </article>
        <article className="card">
          <h3>Core skills</h3>
          <p className="muted">
            List the skills you want to highlight. You can keep it concise and
            focused on the work you want to attract.
          </p>
        </article>
        <article className="card">
          <h3>Availability</h3>
          <p className="muted">
            Mention whether you are open for freelance work, full-time roles, or
            collaborations.
          </p>
        </article>
      </div>

      <article className="card">
        <h3>Now</h3>
        <p className="muted">
          Add a small "now" section to share what you are focusing on this
          season.
        </p>
      </article>
    </section>
  )
}

export default About
