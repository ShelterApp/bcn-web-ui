import React, { lazy } from "react";
import { push } from "connected-react-router";
import { reducerType } from "redux/reducers";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import HeaderBarSub from "components/HeaderBarSub";
import Container from "@material-ui/core/Container";
import styles from "./styles";
// import MdGlobe from "react-ionicons/lib/MdGlobe";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAboutPage } from "api/staticPages";
// import {
//   faFacebookF,
//   faTwitter,
//   faInstagram
// } from "@fortawesome/free-brands-svg-icons";
// import EmailIcon from "@material-ui/icons/Email";
import { useTranslation } from "react-i18next";

const GridFullHeight = lazy(() => import("components/GridFullHeight"));
const GridFormContainer = lazy(() => import("components/GridFormContainer"));

interface AboutProps {
  dispatch: Dispatch;
}

const mapStateToProps = (state: reducerType) => {
  return {};
};

const About = React.memo((props: AboutProps) => {
  const translate = useTranslation().t;
  const { dispatch } = props;
  const classes = styles();
  const openUrl = url => {
    dispatch(push(url));
  };

  const [content, setContent] = React.useState("");
  React.useEffect(() => {
    getAboutPage().then(data => {
      setContent(data.content);
    });
  }, []);

  return (
    <GridFullHeight container>
      <GridFormContainer item xs={12} sm={12} md={12}>
        <GridFullHeight container>
          <HeaderBarSub openUrl={openUrl} name={translate("ABOUT_BCN")} />
          <Container className={classes.root}>
            <div dangerouslySetInnerHTML={{ __html: content }}></div>
          </Container>
        </GridFullHeight>
      </GridFormContainer>
    </GridFullHeight>
  );
});

export default connect(mapStateToProps)(About);
