/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {describe, test, expect, testing} from '@gsa/testing';

import Logger from 'gmp/log';

import {rendererWith, fireEvent, screen} from 'web/utils/testing';

import LoginPage from '../loginpage';

Logger.setDefaultLevel('silent');

describe('LoginPage tests', () => {
  test('should render Loginpage', () => {
    const isLoggedIn = testing.fn().mockReturnValue(false);
    const clearToken = testing.fn();
    const gmp = {isLoggedIn, clearToken, settings: {}};

    const {render} = rendererWith({gmp, router: true, store: true});

    render(<LoginPage />);
  });

  test('should allow to login with username and password', () => {
    const login = testing.fn().mockResolvedValue({
      locale: 'locale',
      username: 'username',
      token: 'token',
      timezone: 'timezone',
    });
    const isLoggedIn = testing.fn().mockReturnValue(false);
    const clearToken = testing.fn();
    const setLocale = testing.fn();
    const setTimezone = testing.fn();
    const gmp = {
      setTimezone,
      setLocale,
      login,
      isLoggedIn,
      clearToken,
      settings: {},
    };
    const {render} = rendererWith({gmp, router: true, store: true});

    const {getByName, getByTestId} = render(<LoginPage />);

    const usernameField = getByName('username');
    const passwordField = getByName('password');

    fireEvent.change(usernameField, {target: {value: 'foo'}});
    fireEvent.change(passwordField, {target: {value: 'bar'}});

    const button = getByTestId('login-button');
    fireEvent.click(button);

    expect(login).toBeCalledWith('foo', 'bar');
  });

  test('should not display guest login by default', () => {
    const isLoggedIn = testing.fn().mockReturnValue(false);
    const clearToken = testing.fn();
    const gmp = {
      isLoggedIn,
      clearToken,
      settings: {},
    };
    const {render} = rendererWith({gmp, router: true, store: true});

    const {queryByTestId} = render(<LoginPage />);

    expect(queryByTestId('guest-login')).not.toBeInTheDocument();
    expect(queryByTestId('guest-login-button')).not.toBeInTheDocument();
  });

  test('should allow to login as guest', () => {
    const login = testing.fn().mockResolvedValue({
      locale: 'locale',
      username: 'username',
      token: 'token',
      timezone: 'timezone',
    });
    const isLoggedIn = testing.fn().mockReturnValue(false);
    const clearToken = testing.fn();
    const setLocale = testing.fn();
    const setTimezone = testing.fn();
    const gmp = {
      setTimezone,
      setLocale,
      login,
      isLoggedIn,
      clearToken,
      settings: {guestUsername: 'foo', guestPassword: 'bar'},
    };
    const {render} = rendererWith({gmp, router: true, store: true});

    const {getByTestId} = render(<LoginPage />);

    const button = getByTestId('guest-login-button');
    fireEvent.click(button);

    expect(login).toBeCalledWith('foo', 'bar');
  });

  test('should display error message', async () => {
    const login = testing.fn().mockRejectedValue({message: 'Just a test'});
    const isLoggedIn = testing.fn().mockReturnValue(false);
    const clearToken = testing.fn();
    const setLocale = testing.fn();
    const setTimezone = testing.fn();
    const gmp = {
      setTimezone,
      setLocale,
      login,
      isLoggedIn,
      clearToken,
      settings: {},
    };
    const {render} = rendererWith({gmp, router: true, store: true});

    const {getByName, getByTestId} = render(<LoginPage />);

    const usernameField = getByName('username');
    const passwordField = getByName('password');

    fireEvent.change(usernameField, {target: {value: 'foo'}});
    fireEvent.change(passwordField, {target: {value: 'bar'}});

    const button = getByTestId('login-button');
    fireEvent.click(button);
    expect(login).toBeCalledWith('foo', 'bar');

    const error = await screen.findByTestId('error');
    expect(error).toHaveTextContent('Just a test');
  });

  test('should redirect to main page if already logged in', () => {
    const login = testing.fn().mockResolvedValue({
      locale: 'locale',
      username: 'username',
      token: 'token',
      timezone: 'timezone',
    });
    const isLoggedIn = testing.fn().mockReturnValue(true);
    const clearToken = testing.fn();
    const setLocale = testing.fn();
    const setTimezone = testing.fn();
    const gmp = {
      setTimezone,
      setLocale,
      login,
      isLoggedIn,
      clearToken,
      settings: {},
    };
    const {render, history} = rendererWith({gmp, router: true, store: true});

    render(<LoginPage />);

    expect(history.location.pathname).toMatch(/^\/$/);
  });
});
