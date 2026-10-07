"use client";

import { FaWikipediaW } from "react-icons/fa";

import styles from "./external-links.module.css";

type Reference = {
  title: string;
  url: string;
};

type ExternalLinksProps = {
  references: Reference[];
};

function linkDisplay(ref: Reference): { label: string; icon: React.ReactNode } {
  if (ref.url.includes("wikipedia.org")) {
    return { label: "Wikipedia", icon: <FaWikipediaW size={18} /> };
  }
  if (ref.url.includes("graphclasses.org")) {
    return {
      label: "graphclasses.org",
      icon: (
        <img
          src="https://www.graphclasses.org/favicon.ico"
          alt="graphclasses.org"
          width={18}
          height={18}
          className={styles["favicon"]}
        />
      ),
    };
  }
  return { label: ref.title, icon: <span className={styles["arrow"]}>&#x2197;</span> };
}

export function ExternalLinks({ references }: ExternalLinksProps) {
  return (
    <div className={styles["links"]}>
      {references.map((ref) => {
        const { label, icon } = linkDisplay(ref);
        return (
          <a
            key={ref.url}
            href={ref.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles["link"]}
            title={label}
          >
            {icon}
          </a>
        );
      })}
    </div>
  );
}
