const errorPhrases = {
  SERVER: "На сервере произошла ошибка, попробуйте ещё раз",
  BAD_REQUEST: "Переданы некорректные данные",
  NOT_FOUND_MOVIE: "Кино с таким номером нет",
  FORBIDDEN_MOVIE_DELET: "Можно удалять только свои фильмы",
  NOT_FOUND_USER: "Пользователь по указанному id не найден",
  NOT_EXIST_USER: "Такого пользователя нет",
  ALREADY_EXIST_USER: "Такой пользователь уже существует",
  WRONG_CREDENTIALS: "Некорректный логин или пароль",
  NOT_AUTHORIZED: "Нет авторизации",
  NOT_FOUND_ADRESS: "Ресурс не найден",
  NOT_CORRECT_LINK: "Некорректная ссылка",
};

const successPhrases = {
  AUTHORIZED: 'Авторизация прошла успешно',
  LOGOUT: 'Вы вышли из приложения',
};

module.exports = { errorPhrases, successPhrases };
