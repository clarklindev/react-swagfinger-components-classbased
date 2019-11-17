import React, { Component } from "react";
import classes from "./ContactUpdate.module.scss";
import Utils from "../../Utils";
import axios from "../../axios-contacts";
import Modal from "../../components/UI/Modal/Modal";
import Button from "../../components/UI/Button/Button";

import SectionHeader from "../../components/UI/Headers/SectionHeader";
import Input from "../../components/UI/Input/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
class ContactUpdate extends Component {
  constructor(props) {
    super(props);
    this.className = Utils.getClassNameString([
      classes.ContactUpdate,
      ContactUpdate.name,
      this.props.className
    ]);
  }

  state = {
    loadedContact: false,
    saving: false,
    contact: {
      id: "",
      name: "",
      lastname: "",
      contactnumbers: [{ number: "" }],
      emails: [{ email: "" }]
    }
  };
  reset = () => {
    this.setState({
      loadedContact: false,
      contact: {
        id: "",
        name: "",
        lastname: "",
        contactnumbers: [{ number: "" }],
        emails: [{ email: "" }]
      },
      saving: false
    });
  };
  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    //get id in url query params
    const id = query.get("id");

    if (id) {
      axios.get(`/contacts/${id}.json`).then(response => {
        console.log("response: ", response.data);

        this.setState(prevState => ({
          loadedContact: true,
          contact: {
            ...prevState.contact,
            id: id
          }
        }));

        Object.keys(response.data).map(item => {
          console.log("item: ", item);
          return this.setState(prevState => ({
            contact: {
              ...prevState.contact,
              [item]: response.data[item]
            }
          }));
        });
      });
    }
  }

  redirect = () => {
    this.props.history.push("/phonebookadmin");
  };

  contactUpdateHandler = () => {
    //validate (super simple...)
    if (
      this.state.contact.name.trim() !== "" &&
      this.state.contact.lastname.trim() !== "" &&
      (this.state.contact.contactnumbers.length ||
        this.state.contact.emails.length)
    ) {
      this.setState({ saving: true });

      return this.props.onContactUpdated(
        {
          id: this.state.contact.id,
          name: this.state.contact.name,
          lastname: this.state.contact.lastname,
          contactnumbers: this.state.contact.contactnumbers,
          emails: this.state.contact.emails
        },
        () => {
          console.log("CALLBACK");
          this.setState({ saving: false });
          this.redirect();
        }
      );
    }
  };

  nameChangeHandler = event => {
    console.log("nameChangeHandler");
    let val = event.target.value; //save value as setState is async and event will get lost
    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        name: val
      }
    }));
  };
  lastnameChangeHandler = event => {
    console.log("lastnameChangeHandler");
    let val = event.target.value; //save value as setState is async and event will get lost
    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        lastname: val
      }
    }));
  };

  //contact
  contactnumberAddHandler = event => {
    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        contactnumbers: prevState.contact.contactnumbers.concat([
          { number: "" }
        ])
      }
    }));
  };

  contactnumberRemoveHandler = i => event => {
    console.log("i:", i);
    let updatedContacts = this.state.contact.contactnumbers.filter(
      (_, index) => i !== index
    );
    console.log("updatedContacts: ", updatedContacts);

    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        contactnumbers: updatedContacts
      }
    }));
  };
  contactnumberChangeHandler = i => event => {
    console.log("contactnumberChangeHandler: ", event.target.value);
    let val = event.target.value;

    const newContacts = this.state.contact.contactnumbers.map(
      (contactnumber, index) => {
        if (i !== index) {
          return contactnumber;
        }
        return { ...contactnumber, number: val };
      }
    );
    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        contactnumbers: newContacts
      }
    }));
  };

  //email
  emailAddHandler = event => {
    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        emails: prevState.contact.emails.concat([{ email: "" }])
      }
    }));
  };

  emailRemoveHandler = i => event => {
    console.log("i:", i);
    let updatedEmails = this.state.contact.emails.filter(
      (_, index) => i !== index
    );
    console.log("updatedContacts: ", updatedEmails);

    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        emails: updatedEmails
      }
    }));
  };

  emailChangeHandler = i => event => {
    console.log("emailChangeHandler: ", event.target.value);
    let val = event.target.value;

    const updatedEmails = this.state.contact.emails.map((email, index) => {
      if (i !== index) {
        return email;
      }
      return { ...email, email: val };
    });
    this.setState(prevState => ({
      contact: { ...prevState.contact, emails: updatedEmails }
    }));
  };

  render() {
    let contact;

    if (this.state.loadedContact === true) {
      let contactnumbers = this.state.contact.contactnumbers.map(
        (each, index) => {
          return (
            <div className={classes.ContactGroup} key={index}>
              <Input
                inputtype="input"
                type="text"
                name="contactnumber"
                placeholder="contact number"
                key={index}
                value={this.state.contact.contactnumbers[index].number}
                changed={this.contactnumberChangeHandler(index)}
              />
              <button
                title="Delete"
                type="button"
                className={classes.RemoveButton}
                onClick={this.contactnumberRemoveHandler(index)}
              >
                <FontAwesomeIcon icon={["far", "trash-alt"]} />
              </button>
            </div>
          );
        }
      );
      let emails = this.state.contact.emails.map((each, index) => {
        return (
          <div className={classes.ContactGroup} key={index}>
            <Input
              inputtype="input"
              type="text"
              name="email"
              placeholder="email"
              key={index}
              value={this.state.contact.emails[index].email}
              changed={this.emailChangeHandler(index)}
            />
            <button
              title="Delete"
              type="button"
              className={classes.RemoveButton}
              onClick={this.emailRemoveHandler(index)}
            >
              <FontAwesomeIcon icon={["far", "trash-alt"]} />
            </button>
          </div>
        );
      });

      contact = (
        <React.Fragment>
          <div className={classes.LabelButtonGroup}>
            <Input
              inputtype="input"
              type="text"
              name="name"
              placeholder="name"
              label="Name"
              value={this.state.contact.name}
              changed={this.nameChangeHandler}
            />
          </div>

          <div className={classes.LabelButtonGroup}>
            <Input
              inputtype="input"
              type="text"
              name="last name"
              placeholder="last name"
              label="Last name"
              value={this.state.contact.lastname}
              changed={this.lastnameChangeHandler}
            />
          </div>

          <label className={classes.Label}>Contact number</label>

          <button
            title="Add"
            className={classes.AddButton}
            onClick={this.contactnumberAddHandler}
          >
            <FontAwesomeIcon icon={["fas", "plus"]} /> Add Number
          </button>

          <ul>{contactnumbers}</ul>

          <label className={classes.Label}>Email</label>

          <button
            title="Add"
            className={classes.AddButton}
            onClick={this.emailAddHandler}
          >
            <FontAwesomeIcon icon={["fas", "plus"]} /> Add Email
          </button>

          <ul>{emails}</ul>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <Modal show={this.state.saving}>
          <p>Updating</p>
        </Modal>

        <div className={this.className}>
          <div className="container">
            <div className={[classes.Wrapper, "container"].join(" ")}>
              <div className="row">
                <div className="col">
                  <SectionHeader>Contact Update</SectionHeader>
                </div>
              </div>
              <div className="row">
                <div className="col">{contact}</div>
              </div>
              <div className="row">
                <div className="col">
                  <button onClick={this.contactUpdateHandler}>save</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default ContactUpdate;
