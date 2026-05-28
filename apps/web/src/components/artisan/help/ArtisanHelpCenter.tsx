"use client";

import { useMemo, useState } from "react";

import { HelpCategoryGrid } from "@/components/artisan/help/HelpCategoryGrid";
import { HelpContactCards } from "@/components/artisan/help/HelpContactCards";
import { HelpContactForm } from "@/components/artisan/help/HelpContactForm";
import { HelpFaqSection } from "@/components/artisan/help/HelpFaqSection";
import { HelpHeroSearch } from "@/components/artisan/help/HelpHeroSearch";
import { HelpSearchResults } from "@/components/artisan/help/HelpSearchResults";
import { HelpVideoTutorials } from "@/components/artisan/help/HelpVideoTutorials";
import { searchFaq, type HelpCategoryId } from "@/components/artisan/help/artisanHelpData";

function scrollToContactForm() {
  document.getElementById("help-contact-form")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export function ArtisanHelpCenter() {
  const [search, setSearch] = useState("");
  const [faqTab, setFaqTab] = useState<HelpCategoryId>("missions");
  const [activeCategory, setActiveCategory] = useState<HelpCategoryId | null>(null);

  const searchResults = useMemo(() => searchFaq(search), [search]);

  const handleCategorySelect = (id: HelpCategoryId) => {
    setActiveCategory(id);
    setFaqTab(id);
    setSearch("");
  };

  const handleSearchResultSelect = (categoryId: HelpCategoryId) => {
    setFaqTab(categoryId);
    setActiveCategory(categoryId);
    setSearch("");
    requestAnimationFrame(() => {
      document.getElementById("help-faq-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <div className="w-full">
      <HelpHeroSearch search={search} onSearchChange={setSearch} />

      <HelpSearchResults
        search={search}
        results={searchResults}
        onSelect={handleSearchResultSelect}
        onContactSupport={scrollToContactForm}
      />

      <HelpContactCards />

      <HelpCategoryGrid activeCategory={activeCategory} onSelect={handleCategorySelect} />

      <div id="help-faq-section">
        <HelpFaqSection faqTab={faqTab} onTabChange={(tab) => {
          setFaqTab(tab);
          setActiveCategory(tab);
        }} />
      </div>

      <HelpVideoTutorials />

      <HelpContactForm />
    </div>
  );
}
