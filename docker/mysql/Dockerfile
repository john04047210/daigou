FROM mysql:5.7
ENV TZ=Asia/Shanghai

COPY ./scripts/backup.sh /home/backup.sh

RUN apt-get update && apt-get install -y locales && rm -rf /var/lib/apt/lists/* \
    && localedef -i zh_CN -c -f UTF-8 -A /usr/share/locale/locale.alias zh_CN.UTF-8 \
    && mkdir ~/backup && chmod +x /home/backup.sh
ENV LANG=zh_CN.utf8
