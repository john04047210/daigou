# -*- coding: utf-8 -*-

"""Click command-line interface for database management."""

from __future__ import absolute_import, print_function

import sys
import hashlib

import click
from click import _termui_impl
from flask.cli import AppGroup, with_appcontext
from sqlalchemy_utils.functions import create_database, database_exists, \
    drop_database
from .database import db as _db
from .models import User

# Fix Python 3 compatibility issue in click
if sys.version_info > (3,):
    _termui_impl.long = int  # pragma: no cover


def abort_if_false(ctx, param, value):
    """Abort command is value is False."""
    if not value:
        ctx.abort()


#
# Database commands
#
db_cli = AppGroup('db')
"""Commond for database"""


@db_cli.command()
@click.option('-v', '--verbose', is_flag=True, default=False)
@with_appcontext
def create(verbose):
    """Create tables."""
    click.secho('Creating all tables!', fg='yellow', bold=True)
    with click.progressbar(_db.metadata.sorted_tables) as bar:
        for table in bar:
            if verbose:
                click.echo(' Creating table {0}'.format(table))
            table.create(bind=_db.engine, checkfirst=True)
    click.secho('Created all tables!', fg='green')


@db_cli.command()
@click.option('-v', '--verbose', is_flag=True, default=False)
@click.option('--yes-i-know', is_flag=True, callback=abort_if_false,
              expose_value=False,
              prompt='Do you know that you are going to drop the db?')
@with_appcontext
def drop(verbose):
    """Drop tables."""
    click.secho('Dropping all tables!', fg='red', bold=True)
    with click.progressbar(reversed(_db.metadata.sorted_tables)) as bar:
        for table in bar:
            if verbose:
                click.echo(' Dropping table {0}'.format(table))
            table.drop(bind=_db.engine, checkfirst=True)
    click.secho('Dropped all tables!', fg='green')


@db_cli.command()
@with_appcontext
def init():
    """Create database."""
    click.secho('Creating database {0}'.format(_db.engine.url),
                fg='green')
    if not database_exists(str(_db.engine.url)):
        create_database(str(_db.engine.url))


@db_cli.command()
@click.option('--yes-i-know', is_flag=True, callback=abort_if_false,
              expose_value=False,
              prompt='Do you know that you are going to destroy the db?')
@with_appcontext
def destroy():
    """Drop database."""
    click.secho('Destroying database {0}'.format(_db.engine.url),
                fg='red', bold=True)
    drop_database(_db.engine.url)


@db_cli.command('add_user')
@click.argument('email')
@click.password_option()
@click.option('-a', '--active', is_flag=True, default=False)
@with_appcontext
def create_user(email, password, active):
    """Create new user."""
    if email and password:
        hl = hashlib.md5()
        hl.update(password.encode(encoding='utf-8'))
        password2 = hl.hexdigest()
        click.secho('md5(password)={0}.'.format(password2), fg='green', bold=True)
        hl = hashlib.md5()
        hl.update(password2.encode(encoding='utf-8'))
        password2 = hl.hexdigest()
        click.secho('md5(md5(password))={0}.'.format(password2), fg='green', bold=True)
        user = User()
        user.email = email
        user.password = password2
        user.active = active
        user.admin = False
        user.add_new_user()
        click.secho('User created successfully.', fg='green', bold=True)
        kwargs = dict(uid=user.id, email=email, password=password, active='y' if active else '')
        click.echo(kwargs)
    else:
        click.UsageError('Error creating user: arguments error')


@db_cli.command('chg_pwd')
@click.argument('email')
@click.password_option()
@with_appcontext
def change_pwd(email, password):
    """Reset user password."""
    if email and password:
        hl = hashlib.md5()
        hl.update(password.encode(encoding='utf-8'))
        password2 = hl.hexdigest()
        hl = hashlib.md5()
        hl.update(password2.encode(encoding='utf-8'))
        password2 = hl.hexdigest()
        user = User.get_user_by_email(email)
        if user:
            user.password = password2
            user.upt_cur_user()
            click.secho('User change password successfully.', fg='green', bold=True)
            kwargs = dict(email=email, password=password)
            click.secho(kwargs, fg='green')
        else:
            kwargs = dict(email=email, error='user not found')
            click.secho(kwargs, fg='red')
    else:
        click.UsageError('Error changing password: arguments error')


@db_cli.command('set_admin')
@click.argument('email')
@with_appcontext
def set_admin(email):
    """Change User to admin."""
    if email:
        user = User.get_user_by_email(email)
        if user:
            user.admin = True
            user.upt_cur_user()
            click.secho('User set admin successfully.', fg='green', bold=True)
        else:
            kwargs = dict(email=email, error='user not found')
            click.secho(kwargs, fg='red')
    else:
        click.UsageError('Error set admin: arguments error')


@db_cli.command('unset_admin')
@click.argument('email')
@with_appcontext
def unset_admin(email):
    """Remove admin for User."""
    if email:
        user = User.get_user_by_email(email)
        if user:
            user.admin = False
            user.upt_cur_user()
            click.secho('User set admin successfully.', fg='green', bold=True)
        else:
            kwargs = dict(email=email, error='user not found')
            click.secho(kwargs, fg='red')
    else:
        click.UsageError('Error set admin: arguments error')


@db_cli.command('del_user')
@click.argument('email')
@with_appcontext
def create_user(email):
    """Remove user."""
    if email:
        user = User.get_user_by_email(email)
        user.del_cur_user()
        click.secho('User deleted successfully.', fg='green', bold=True)
        kwargs = dict(email=email)
        click.echo(kwargs)
    else:
        click.UsageError('Error delete user: arguments error')
