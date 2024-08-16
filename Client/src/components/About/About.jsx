import React from 'react'
import classes from './About.module.css'

function About() {
  return (
    <div className={classes.login__about}>
      <p className={classes.about}>About</p>
      <div className={classes.about__title}>
        <h1>Evangadi Networks Q & A</h1>
      </div>
      <div className="about__Discription">
        <p>
          No matter what stage of life you are in, whether you're just
          starting elementary school or being promoted to CEO of a Fortune
          500 company, you have much to offer to those who are trying to
          follow in your footsteps.
        </p>
        <br />
        <p>
          Wheather you are willing to share your knowledge or you are just
          looking to meet mentors of your own, please start by joining the
          network here.
        </p>
      </div>
      <button className={classes.how_it_works}>HOW IT WORKS</button>
    </div>
  )
}

export default About;
