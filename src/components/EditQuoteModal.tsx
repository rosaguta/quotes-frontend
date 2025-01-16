import { Button } from "./ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import {useState, useEffect} from 'react'
const EditQuoteModal = ({ isOpen, toggleModal, Quote, onSave }) => {
  const [editedQuote, setEditedQuote] = useState(Quote);
  useEffect(() => {
    setEditedQuote(Quote); // Update local state when Quote prop changes
  }, [Quote]);
  if (!isOpen) return null;
  
  
    
  
    const handleInputChange = (field, value) => {
      setEditedQuote((prev) => ({
        ...prev,
        [field]: value,
      }));
    };
  
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={() => toggleModal(false)}
      >
        <div
          className="w-1/3 bg-white rounded-lg shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <Card>
            <CardHeader>
              <CardTitle>Edit Quote</CardTitle>
            </CardHeader>
            <CardContent>
              <Label>Quote text</Label>
              <Input
                value={editedQuote?.text || ""}
                onChange={(e) => handleInputChange("text", e.target.value)}
              />
              <Label>Person</Label>
              <Input
                value={editedQuote?.person || ""}
                onChange={(e) => handleInputChange("person", e.target.value)}
              />
              <Label>DateTime</Label>
              <Input
                value={editedQuote?.dateTimeCreated || ""}
                onChange={(e) => handleInputChange("dateTimeCreated", e.target.value)}
              />
              <Label>Context</Label>
              <Input
                value={editedQuote?.context || ""}
                onChange={(e) => handleInputChange("context", e.target.value)}
              />
              <div className="mt-4 flex w-full justify-center">
                <Button
                  className="bg-indigo-700 hover:bg-indigo-500"
                  onClick={() => onSave(editedQuote)}
                >
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
export default EditQuoteModal