import React from "react";
import { ServiceProps } from "common/";
import ServiceItemDetail from "components/ServiceItemDetail";
import { ICoords } from "redux/reducers/service";

interface ServiceDetailContainerProps {
  data: ServiceProps;
  openUrl: Function;
  currentLocation: ICoords;
  onClickFlag: Function;
  onClickReport: Function;
  onClickClaim: Function;
}

const ServiceDetailContainer = React.memo(
  (props: ServiceDetailContainerProps) => {
    const {
      data,
      openUrl,
      currentLocation,
      onClickFlag,
      onClickReport,
      onClickClaim
    } = props;
    React.useEffect(() => {
      if (data && data.name) {
        document.title = data.name;
      }
      window.scrollTo(0, 0);
    }, []);
    return (
      <>
        <ServiceItemDetail
          currentLocation={currentLocation}
          service={data}
          openUrl={openUrl}
          onClickFlag={onClickFlag}
          onClickReport={onClickReport}
          onClickClaim={onClickClaim}
        />
      </>
    );
  }
);

export default ServiceDetailContainer;
