import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import classes from './Footer.module.css';
import logo from '../../assets/logo.png';

const Footer = () => {
  const socialLinks = [
    { icon: <FaFacebook />, url: 'https://www.facebook.com/evangaditech' },
    { icon: <FaInstagram />, url: 'https://www.instagram.com/evangaditech/' },
    { icon: <FaYoutube />, url: 'https://www.youtube.com/@EvangadiTech' }
  ];

  return (
    <motion.footer
      className={classes.footer}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={classes.footerContainer}>
        <motion.div
          className={classes.footerColumn}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <img src={logo} alt="Evangadi Logo" className={classes.footerLogo} />
          <div className={classes.socialIcons}>
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={classes.socialIcon}
                whileHover={{ scale: 1.2, color: '#e98f39' }}
                whileTap={{ scale: 0.9 }}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div
          className={classes.footerLinks}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3>Useful Links</h3>
          <ul>
            <motion.li whileHover={{ x: 5 }}>
              <Link to="/how-it-works">How it works</Link>
            </motion.li>
            <motion.li whileHover={{ x: 5 }}>
              <Link to="#">Terms of Service</Link>
            </motion.li>
            <motion.li whileHover={{ x: 5 }}>
              <Link to="#">Privacy Policy</Link>
            </motion.li>
          </ul>
        </motion.div>

        <motion.div
          className={classes.footerLinks}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3>Contact Info</h3>
          <motion.p whileHover={{ x: 5 }}>Evangadi Networks</motion.p>
          <motion.p whileHover={{ x: 5 }}>support@evangadi.com</motion.p>
          <motion.p whileHover={{ x: 5 }}>+1-202-386-2702</motion.p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
