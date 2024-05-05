import pytest
from unittest.mock import MagicMock

from src.controllers.usercontroller import UserController

USERS = [
    {
        'firstName': 'Jane',
        'lastName': 'Doe',
        'email': 'jane.doe@gmail.com'
    },
    {
        'firstName': 'John',
        'lastName': 'Doe',
        'email': 'john@gmail.com'
    },
    {
        'firstName': 'John',
        'lastName': 'Poe',
        'email': 'john@gmail.com'
    }
]

@pytest.fixture
def sut(email):
    mockedDAO = MagicMock()
    mockedDAO.find.return_value = USERS
    mockedsut = UserController(dao=mockedDAO)
    return mockedsut

@pytest.mark.unit
@pytest.mark.parametrize('email, expected', [
    ('jane.doe@gmail.com', USERS[0]),
    ('john@gmail.com', USERS[1]),
    ('not.found@gmail.com', None)])
def test_get_user_by_email(sut, email, expected):
    validationresult = sut.get_user_by_email(email)
    assert validationresult == expected

