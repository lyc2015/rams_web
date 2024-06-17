import React from "react";
import { ListGroup, Button, Accordion } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router-dom";

const MenuItem = ({ icon, text, eventKey, isHover, onMouseEnter, onMouseLeave, onClick, subMenuItems }) => {
  const menuStyle = {
    borderBottom: "0.1px solid #167887",
    backgroundColor: "#17a2b8",
  };
  const menuStyleHover = {
    borderBottom: "0.1px solid #167887",
    backgroundColor: "#188596",
  };
  const subMenuStyle = {
    backgroundColor: "#ffffff",
  };
  const subMenuStyleHover = {
    backgroundColor: "#d3d3d3",
  };

  return (
    <ListGroup.Item
      style={isHover ? menuStyleHover : menuStyle}
      data-place="right"
      data-type="info"
      data-tip=""
      data-for={text}
      data-class="my-tabcolor"
      data-effect="solid"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Accordion.Toggle as={Button} variant="link" eventKey={eventKey} onClick={onClick}>
        <FontAwesomeIcon className="fa-fw" size="lg" icon={icon} /> {text}
      </Accordion.Toggle>
      <ReactTooltip
        id={text}
        delayUpdate={1000}
        getContent={() => (
          <div onClick={onClick}>
            <ListGroup>
              <Accordion className="menuCol">
                {subMenuItems.map((item, index) => (
                  <ListGroup.Item
                    key={index}
                    style={isHover === item.key ? subMenuStyleHover : subMenuStyle}
                  >
                    <div>
                      <Link className={isHover === item.key ? "my-tabcolor-font-hover" : "my-tabcolor-font"} to={item.path}>
                        <FontAwesomeIcon className="fa-fw" size="lg" icon={item.icon} /> {item.label}
                      </Link>
                    </div>
                  </ListGroup.Item>
                ))}
              </Accordion>
            </ListGroup>
          </div>
        )}
      />
    </ListGroup.Item>
  );
};

export default MenuItem;
