create table corpus_match
(
    id int auto_increment
        primary key,
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
    sourceuri varchar(255) not null,
    source_type varchar(255) not null,
    is_visible tinyint(1) not null,
    replacement_suggestion varchar(255) not null
)
    charset=utf8mb4;

create table html_node
(
    id int auto_increment
        primary key,
    source_uri varchar(255) not null,
    xpath varchar(255) not null,
    tag_name varchar(16) not null,
    constraint html_tag_unique
        unique (source_uri, tag_name, xpath)
)
    charset=utf8mb4;


create table html_attribute
(
    id int auto_increment
        primary key,
    source_uri varchar(255) not null,
    node_xpath varchar(255) not null,
    attribute_name varchar(32) not null,
    attribute_value text not null,
    constraint html_attribute_unique
        unique (source_uri, node_xpath, attribute_name, attribute_value) using hash
)
    charset=utf8mb4;
