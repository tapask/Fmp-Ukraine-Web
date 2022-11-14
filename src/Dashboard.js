import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { auth, db, logout } from "./firebase";
import { link, useNavigate } from "react-router-dom";
import tick from "./img/tick.jpg";
import wrong from "./img/wrong.jpg";

// react-bootstrap components
import { Button, Table, Row, Col } from "react-bootstrap";

const baseurl = "http://3.143.143.14:8000";
// var navigate;

function Dashboard() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const logout = async () => {
    localStorage.removeItem("Token");
    await auth.signOut();
    navigate("/");
  };

  const handle = () => {
    localStorage.setItem("Token", name);
  };
  const refresh = () => {
    getAnswer();
  };
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");

  const popup = (url) => {
    setIsOpen(!isOpen);
    setUrl(url);
  };

  const editRow = async (rowIndex) => {
    try {
      const token = localStorage.getItem("Token");
      console.log(token);
      const response = await axios.put(
        baseurl + "/identityverification/" + rowIndex,
        JSON.stringify({
          status: 1,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: token,
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };
  const deleteRow = async (rowIndex) => {
    try {
      const token = localStorage.getItem("Token");
      console.log(token);
      const response = await axios.put(
        baseurl + "/identityverification/" + rowIndex,
        JSON.stringify({
          status: 0,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            status: "0",
          }),
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const [val, setVal] = useState();

  useEffect(() => {
    getAnswer();
  }, []);

  // const getAnswer = async () => {
  //   var result = [
  //     {
  //     "id": 12,
  //     "image_name": "https://media.gettyimages.com/photos/pancakes-picture-id96430985",
  //     "status": 0,
  //     "created_at": "2022-03-17T08:53:23.808Z"
  //     },
  //     {
  //     "id": 17,
  //     "image_name": "https://www.holemanlandscape.com/wp-content/uploads/2014/08/trees.jpg",
  //     "status": 2,
  //     "created_at": "2022-03-21T10:08:33.678Z"
  //     }
  //    ]
  //   setVal(result);
  // };

  const getAnswer = async () => {
    try {
      const token = localStorage.getItem("Token");
      if (token == null) {
        navigate("/");
      }
      const response = await axios.get(baseurl + "/identityverification", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        },
      });
      if (response.status === 200) {
        const result = await response.data;
        setVal(result);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {refresh}
      <div className="content">
        <Row>
          <Col md="2">
            <div>
              <button onClick={refresh}>Refresh</button>
            </div>
          </Col>
          <Col md="2">
            <div>
              <button className="dashboard__btn" onClick={logout}>
                Logout
              </button>
            </div>
          </Col>
        </Row>
        <Table className="table-hover table-striped">
          <thead>
            <tr>
              <th className="border-0">Id</th>
              <th className="border-0">Email</th>
              <th className="border-0">Image</th>
              <th className="border-0">Location</th>
              <th className="border-0">Status</th>
              <th className="border-0">Created_At</th>
              <th className="border-0">Action</th>
            </tr>
          </thead>
          <tbody>
            {val && val.length > 0 ? (
              val.map((data, index) => {
                return (
                  <tr key={index}>
                    <td>{data.id}</td>
                    <td>{data.user_email}</td>
                    <td>
                      <img
                        src={data.image_name}
                        width="70"
                        onClick={() => popup(data.image_name)}
                      />

                      {isOpen ? (
                        <div
                          className="dialog"
                          style={{ position: "absolute", width: "100" }}
                          open
                          onClick={() => popup(data.image_name)}
                        >
                          <img
                            className="image"
                            src={url}
                            onClick={() => popup(data.image_name)}
                            alt="no image"
                          />
                        </div>
                      ) : null}
                    </td>
                    <td>
                      {data.user.location === null ? (
                        ""
                      ) : (
                        <>
                          {/* <span>{data.user.location[0]}</span> <br />
                          <span>{data.user.location[1]}</span> */}
                          {/* <div>
                            <iframe
                              id="iframeId"
                              height="200px"
                              width="200px"
                              src={`https://maps.google.com/maps?q=${data.user.location[1]},${data.user.location[0]}&hl=es;&output=embed`}
                            ></iframe>
                          </div> */}

                          <button
                            type="button"
                            class="btn fw-semibold"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                          >
                            Location
                          </button>

                          <div
                            class="modal fade "
                            id="exampleModal"
                            tabindex="-1"
                            aria-labelledby="exampleModalLabel"
                            aria-hidden="true"
                          >
                            <div class="modal-dialog">
                              <div class="modal-content">
                                
                                <div class="modal-body p-0">
                                  <iframe
                                  className="bg-primary w-100"
                                    id="iframeId"
                                    height="400px"
                                    width="400px"
                                    src={`https://maps.google.com/maps?q=${data.user.location[1]},${data.user.location[0]}&hl=es;&output=embed`}
                                  ></iframe>
                                </div>
                                
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </td>
                    <td>
                      {data.status == "1"
                        ? "Approved"
                        : data.status == "0"
                        ? "Denied"
                        : "Processing"}
                    </td>
                    <td>{data.created_at}</td>
                    <td>
                      <span
                        onClick={() => {
                          const confirmBox = window.confirm(
                            "Do you really want to approve"
                          );
                          if (confirmBox === true) {
                            editRow(data.id);
                          }
                        }}
                      >
                        <img src={tick} height={20} width={20}></img>
                      </span>
                      <span
                        onClick={() => {
                          const confirmBox = window.confirm(
                            "Do you really want to deny"
                          );
                          if (confirmBox === true) {
                            deleteRow(data.id);
                          }
                        }}
                      >
                        <img src={wrong} height={20} width={20}></img>
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td>{"No data found"} </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default Dashboard;
