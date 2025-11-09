import axios from "axios";
import NodeCache from "node-cache";
import { Request, Response } from "express";
import { env } from "../config/env";

const cache = new NodeCache({ stdTTL: 60 * 5 });

interface Product {
  name?: string;
  category?: string;
  [key: string]: any;
}

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { search = "", page = "1", limit = "10" } = req.query;

    const searchTerm = (search as string).toLowerCase().trim();
    const currentPage = Math.max(1, parseInt(page as string, 10) || 1);
    const perPage = Math.max(1, parseInt(limit as string, 10) || 10);

    console.log("🔍 getProducts called with", { searchTerm, currentPage, perPage });

    const cacheKey = `products_${searchTerm}_${currentPage}_${perPage}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log("✅ Serving from cache:", cacheKey);
      return res.json(cached);
    }

    console.log("🟡 Fetching data from external API...");
    const { data } = await axios.get<Product[]>(`${env.mockApiBaseUrl}/products`);


    console.log("🔍 Sample items:", data.slice(0, 5));

    const filtered = data.filter(p => {
      const nameVal = typeof p.name === "string" ? p.name.toLowerCase().trim() : "";
      const categoryVal = typeof p.category === "string" ? p.category.toLowerCase().trim() : "";

      if (!searchTerm) {
    
        return true;
      }

      const matchesName = nameVal.includes(searchTerm);
      const matchesCategory = categoryVal.includes(searchTerm);

      return matchesName || matchesCategory;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / perPage);
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const results = filtered.slice(start, end);

    const responseData = {
      search: searchTerm || null,
      page: currentPage,
      limit: perPage,
      total,
      totalPages,
      results,
    };

    cache.set(cacheKey, responseData);
    console.log("✅ Responding with filtered results count:", total);

    return res.json(responseData);
  } catch (error) {
    console.error("❌ Error in getProducts:", error);
    return res.status(500).json({ message: "Failed to fetch products" });
  }
};
