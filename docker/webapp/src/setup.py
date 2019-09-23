# -*- coding: utf-8 -*-

import os

from setuptools import find_packages, setup

tests_require = [
    'check-manifest>=0.25',
    'coverage>=4.0',
    'isort>=4.3.3',
    'pydocstyle>=1.0.0',
    'pytest-cache>=1.0',
    'pytest-cov>=1.8.0',
    'pytest-pep8>=1.0.6',
    'pytest>=2.8.0',
]

extras_require = {
    'docs': [
        'Sphinx>=1.5.1',
    ],
    'win32': [
        'pywin32>=224',
    ],
    'tests': tests_require,
}

extras_require['all'] = []
for reqs in extras_require.values():
    extras_require['all'].extend(reqs)

setup_requires = [
    'Babel>=1.3',
    'pytest-runner>=2.6.2',
]

install_requires = [
    'cachetools>=3.1.0',
    'APScheduler>=3.5.3',
    'Click>=7.0',
    'colorama>=0.4.1',
    'Flask>=0.12.2',
    'Flask-Cors>=3.0.7',
    'Flask-BabelEx>=0.9.2',
    'Flask-Login>=0.4.1',
    'Flask-SQLAlchemy>=2.3.2',
    'SQLAlchemy>=1.2.17',
    'SQLAlchemy-Utils>=0.33.11',
    'Blinker>=1.4',
    'Werkzeug>=0.14.1',
    'lxml>=4.3.3',
    'openpyxl>=2.6.2',
    'paho-mqtt>=1.4.0',
    'requests>=2.22.0',
]

packages = find_packages()


# Get the version string. Cannot be done with import!
g = {}
with open(os.path.join('ocrweb', 'version.py'), 'rt') as fp:
    exec(fp.read(), g)
    version = g['__version__']

setup(
    name='ocr-webapp',
    version=version,
    description=__doc__,
    keywords='ocr webapp',
    license='MIT',
    author='QiaoPeng',
    author_email='a1103.qiaop@neusoft.co.jp',
    url='https://iot.neusoft.co.jp/qiaopeng/pocwebapp',
    packages=packages,
    zip_safe=False,
    include_package_data=True,
    platforms='any',
    entry_points={},
    extras_require=extras_require,
    install_requires=install_requires,
    setup_requires=setup_requires,
    tests_require=tests_require,
    classifiers=[
        'Environment :: Web Environment',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: GNU General Public License v2 (GPLv2)',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
        'Topic :: Software Development :: Libraries :: Python Modules',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.5',
        'Development Status :: 1 - Planning',
    ],
)
