create table custom_traits
(
    id          varchar(50)                         not null
        primary key,
    name        varchar(100)                        not null,
    image_url   text                                null,
    description text                                null,
    created_at  timestamp default CURRENT_TIMESTAMP null
);

create table funds
(
    id               varchar(50)                         not null
        primary key,
    date             date      default (curdate())       null,
    contributor_name varchar(100)                        null,
    amount           decimal(15, 2)                      not null,
    note             text                                null,
    image_url        text                                null,
    created_at       timestamp default CURRENT_TIMESTAMP null
);

create table players
(
    id               int                                   not null
        primary key,
    name             varchar(100)                          not null,
    phone            varchar(20)                           null,
    dob              date                                  null,
    height_cm        int                                   null,
    weight_kg        int                                   null,
    position         varchar(50)                           null,
    jersey_number    int                                   null,
    image_url        text                                  null,
    total_attendance int         default 0                 null,
    created_at       timestamp   default CURRENT_TIMESTAMP null,
    dominant_foot    varchar(10) default 'Right'           null,
    pac              int         default 50                null,
    sho              int         default 50                null,
    pas              int         default 50                null,
    dri              int         default 50                null,
    def              int         default 50                null,
    phy              int         default 50                null,
    traits_json      json                                  null
);

create table sessions
(
    id             varchar(50)                                       not null
        primary key,
    date           date                                              not null,
    note           text                                              null,
    status         enum ('OPEN', 'CLOSED') default 'CLOSED'          null,
    created_at     timestamp               default CURRENT_TIMESTAMP null,
    secret_icon_id varchar(50)                                       null
);

create table attendance
(
    session_id    varchar(50)                         not null,
    player_id     int                                 not null,
    checked_in_at timestamp default CURRENT_TIMESTAMP null,
    primary key (session_id, player_id),
    constraint attendance_ibfk_1
        foreign key (session_id) references sessions (id)
            on delete cascade,
    constraint attendance_ibfk_2
        foreign key (player_id) references players (id)
            on delete cascade
);

create index player_id
    on attendance (player_id);

create table attendance_attempts
(
    session_id      varchar(50)                          not null,
    player_id       int                                  not null,
    attempt_count   int        default 0                 null,
    blocked         tinyint(1) default 0                 null,
    last_attempt_at timestamp  default CURRENT_TIMESTAMP null,
    primary key (session_id, player_id),
    constraint attendance_attempts_ibfk_1
        foreign key (session_id) references sessions (id)
            on delete cascade,
    constraint attendance_attempts_ibfk_2
        foreign key (player_id) references players (id)
            on delete cascade
);

create index player_id
    on attendance_attempts (player_id);

create table teams
(
    id         varchar(10)                   not null
        primary key,
    name       varchar(100)                  not null,
    captain_id int                           null,
    color_hex  varchar(20) default '#000000' null,
    constraint teams_ibfk_1
        foreign key (captain_id) references players (id)
            on delete set null
);

create table team_members
(
    team_id   varchar(10) not null,
    player_id int         not null,
    primary key (team_id, player_id),
    constraint team_members_ibfk_1
        foreign key (team_id) references teams (id)
            on delete cascade,
    constraint team_members_ibfk_2
        foreign key (player_id) references players (id)
            on delete cascade
);

create index player_id
    on team_members (player_id);

create index captain_id
    on teams (captain_id);

create table users
(
    id           int auto_increment
        primary key,
    username     varchar(50)                                        not null,
    password     varchar(255)                                       not null,
    display_name varchar(100)                                       null,
    role         enum ('admin', 'player') default 'player'          null,
    player_id    int                                                null,
    created_at   timestamp                default CURRENT_TIMESTAMP null,
    constraint player_id
        unique (player_id),
    constraint username
        unique (username),
    constraint users_ibfk_1
        foreign key (player_id) references players (id)
            on delete cascade
);

