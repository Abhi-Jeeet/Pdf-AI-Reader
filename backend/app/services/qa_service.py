from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain.llms import OpenAI
from ..config import OPENAI_API_KEY

class QAService:
    def __init__(self):
        self.text_splitter = CharacterTextSplitter(
            separator="\n",
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        self.embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)

    def process_document(self, text: str):
        texts = self.text_splitter.split_text(text)
        return FAISS.from_texts(texts, self.embeddings)

    def get_answer(self, vectorstore, question: str) -> str:
        docs = vectorstore.similarity_search(question)
        chain = load_qa_chain(OpenAI(openai_api_key=OPENAI_API_KEY), chain_type="stuff")
        return chain.run(input_documents=docs, question=question) 