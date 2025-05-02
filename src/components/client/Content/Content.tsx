"use client";

import React from "react";
import styles from "@/styles/Content.module.scss"; // Import SCSS
import TrendingBook from "@/components/client/Book/Book.carousel"; // Import carousel
import { Card } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import { faFireFlameCurved } from "@fortawesome/free-solid-svg-icons"; // Import icon cụ thể

const Content: React.FC = () => {
  return (
    <div className={styles.contentWrapper}>
      {/* Truyện nổi bật */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <FontAwesomeIcon icon={faFireFlameCurved} className={styles.icon} />
          <h2>Truyện nổi bật</h2>
        </div>
        <TrendingBook />
      </section>
    </div>
  );
};

export default Content;
