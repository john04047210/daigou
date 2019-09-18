FROM mysql:5.7
ENV TZ=Asia/Tokyo

COPY ./scripts/backup.sh /home/backup.sh

RUN apt-get update && apt-get install -y locales && rm -rf /var/lib/apt/lists/* \
    && localedef -i ja_JP -c -f UTF-8 -A /usr/share/locale/locale.alias ja_JP.UTF-8 \
    && mkdir ~/backup && chmod +x /home/backup.sh
ENV LANG=ja_JP.utf8
