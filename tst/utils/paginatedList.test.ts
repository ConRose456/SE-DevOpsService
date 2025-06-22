import { paginateResponse } from "../../src/utils/paginatedList";

const TEST_BOOK_ONE = {
  id: 123456789,
  title: "test-title",
  description: "test-description",
  authors: ["test-author"],
};

const TEST_BOOK_TWO = {
  id: 234567891,
  title: "test-title-2",
  description: "test-description-2",
  authors: ["test-author-2"],
};

const TEST_BOOK_THREE = {
  id: 345678912,
  title: "test-title-3",
  description: "test-description-3",
  authors: ["test-author-3"],
};

describe("Paginated List", () => {
    it("returns  only the request nnumber of edges", async () => {
        const result = paginateResponse(
            [TEST_BOOK_ONE, TEST_BOOK_TWO],
            {
                first: 1,
            }
        );

        expect(result.edges).toHaveLength(1);
        expect(result).toEqual({
            total: 2,
            hasNext: true,
            edges: [
                {
                    cursor: TEST_BOOK_ONE.id,
                    node: TEST_BOOK_ONE
                }
            ]
        });
    });

    it("returns the correct page of books", async () => {
        const result = paginateResponse(
            [TEST_BOOK_ONE, TEST_BOOK_TWO, TEST_BOOK_THREE],
            {
                first: 1,
                after: `${TEST_BOOK_ONE.id}`
            }
        );

        expect(result.edges).toHaveLength(1);
        expect(result).toEqual({
            total: 3,
            hasNext: true,
            edges: [
                {
                    cursor: TEST_BOOK_TWO.id,
                    node: TEST_BOOK_TWO
                }
            ]
        });
    });

    it("handles an invalid cursor correctly by returning the inital content", async () => {
        const result = paginateResponse(
            [TEST_BOOK_ONE, TEST_BOOK_TWO, TEST_BOOK_THREE],
            {
                first: 1,
                after: `90876597`
            }
        );

        expect(result.edges).toHaveLength(1);
        expect(result).toEqual({
            total: 3,
            hasNext: true,
            edges: [
                {
                    cursor: TEST_BOOK_ONE.id,
                    node: TEST_BOOK_ONE
                }
            ]
        });
    });

    it("handles an cursor for non existing page bt returning empty edges", async () => {
        const result = paginateResponse(
            [TEST_BOOK_ONE, TEST_BOOK_TWO, TEST_BOOK_THREE],
            {
                first: 1,
                after: `${TEST_BOOK_THREE.id}`
            }
        );

        expect(result.edges).toHaveLength(0);
        expect(result).toEqual({
            total: 3,
            hasNext: false,
            edges: []
        });
    });
});