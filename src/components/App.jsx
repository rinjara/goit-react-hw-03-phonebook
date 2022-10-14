import { ContactForm } from './ContactForm/ContactForm';
import { ContactList } from './ContactList/ContactList';
import { Filter } from './Filter/Filter';
import { MainTitle, Wrapper, Title } from './App.styled';
import { Component } from 'react';
import { nanoid } from 'nanoid';

export class App extends Component {
  state = {
    contacts: [
      { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
      { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
      { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
      { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
    ],
    filter: '',
  };

  componentDidMount() {
    const savedContacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(savedContacts);
    if (parsedContacts) {
      this.setState({
        contacts: parsedContacts,
      });
    }
  }

  componentDidUpdate(_, prevState) {
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  handleSubmit = (values, { resetForm }) => {
    const result = this.compairNames(values);
    if (result) return;

    values.id = nanoid();
    this.setState(({ contacts }) => {
      return { contacts: [values, ...contacts] };
    });
    resetForm();
  };

  compairNames = friendInfo => {
    const { contacts } = this.state;
    const found = contacts.find(
      ({ name }) => name.toLowerCase() === friendInfo.name.toLowerCase()
    );
    if (found) alert(`${friendInfo.name} already in the list`);
    return found;
  };

  handleFilterChange = e => {
    this.setState({ filter: e.target.value });
  };

  getFilteredFriends = () => {
    const { filter, contacts } = this.state;

    const normalizedFilterValue = filter.toLowerCase();
    return contacts.filter(({ name }) =>
      name.toLowerCase().includes(normalizedFilterValue)
    );
  };

  deleteFriend = friendId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== friendId),
    }));
  };

  render() {
    const { handleSubmit, handleFilterChange, deleteFriend } = this;
    const { filter } = this.state;
    const filteredFriends = this.getFilteredFriends();

    return (
      <Wrapper>
        <MainTitle>Phonebook</MainTitle>
        <ContactForm onSubmit={handleSubmit} />

        <Title>Contacts</Title>
        <Filter onChange={handleFilterChange} value={filter} />
        <ContactList contacts={filteredFriends} onDeleteFriend={deleteFriend} />
      </Wrapper>
    );
  }
}
