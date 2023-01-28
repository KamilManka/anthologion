import Anchor from "antd/es/anchor/Anchor";
import React from "react";
import Link from "antd/es/typography/Link";

const Footer = () => {
  return (
    <div className="footer">
      Wszystkie teksty zostały zaczerpnięte z przekładu ks. Henryka Paprockiego,
      który można znaleźć na{" "}
      <Link target="_blank" href="http://www.liturgia.cerkiew.pl/page.php?id=14">
        stronie kaplicy świętego męczennika archimandryty Grzegorza
      </Link>{" "}
      w Warszawie. Ponieważ strona jest na etapie eksperymentalnym, twórcy nie
      wystąpili jeszcze o oficjalną zgodę na użycie tekstów.
    </div>
  );
};

export default Footer;
