"use client";

import React from "react";
import { Card } from "antd";
import { faker } from "@faker-js/faker";

const { Meta } = Card;

// Tạo dữ liệu giả
const generateFakeBooks = (count: number) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    title: faker.lorem.words(3),
    description: faker.internet.url(),
    cover: faker.image.url({ width: 240, height: 320 }), // Hình ảnh giả
  }));
};

const BookCard: React.FC = () => {
  const books = generateFakeBooks(10); // Tạo 10 sách giả

  return (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      {books.map((book) => (
        <Card
          key={book.id}
          hoverable
          style={{ width: 240 }}
          cover={<img alt={book.title} src={book.cover} />}
        >
          <Meta title={book.title} description={book.description} />
        </Card>
      ))}
    </div>
  );
};

export default BookCard;
