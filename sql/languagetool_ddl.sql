create table corpus_article
(
    id int auto_increment
        primary key,
    title varchar(255) not null,
    revision int not null,
    text text not null
)
    charset=utf8mb4;

create table corpus_match
(
    id int auto_increment
        primary key,
    article_id int not null,
    version tinyint not null,
    language_code varchar(16) not null,
    ruleid varchar(255) not null,
    rule_category varchar(255) not null,
    rule_subid varchar(16) null,
    rule_description varchar(255) not null,
    message varchar(255) not null,
    error_context mediumtext not null,
    small_error_context mediumtext not null,
    corpus_date date not null,
    check_date date not null,
    source_type varchar(255) not null,
    is_visible tinyint(1) not null,
    replacement_suggestion varchar(255) not null,
    applied tinyint(1) null,
    constraint corpus_match___fk_article_id
        foreign key (article_id) references corpus_article (id)
)
    charset=utf8mb4;

create table html_attribute
(
    id int auto_increment
        primary key,
    article_id int not null,
    parent_id int null,
    child_index int not null,
    attribute_name varchar(32) not null,
    attribute_value text not null,
    constraint html_attribute___fk_article_id
        foreign key (article_id) references corpus_article (id)
)
    charset=utf8mb4;

create table html_node
(
    id int auto_increment
        primary key,
    article_id int not null,
    parent_id int null,
    child_index int not null,
    tag_name varchar(16) not null,
    constraint html_node___fk_article_id
        foreign key (article_id) references corpus_article (id)
)
    charset=utf8mb4;
