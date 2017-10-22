# find 3rd party data (eg,kaggle), choose a few variables from 3-party-data, and current public data, merge them into a new df
# predict likelihood to purchase a product, using decision tree (each scale of likelihood of purchase is a group), randomly simulate response by changing the features and seeing the impact of on the pontential of purchasing
# use D3 to plot scatterplot or sth else, y-axis: scale of likelihood for consumers to purchase product (scale:0-10), x-axis: number of consumers (quantity). for each product (use drag box), shows the scale and no. of comsumers OR/AND have multiple feature/variables to select factors such as income, and adjust it to influence scale-consumer scatter plot graph 

library(randomForest)
# library(tree)
# file <- read.csv("/Users/tracy/Desktop/practice/product_predict/product_predict.csv",sep=",")
kaggle_train <- read.csv("/Users/tracy/Desktop/practice/project1/train_ver2.csv",sep=",")   #2.29Gb 
kaggle_test <- read.csv("/Users/tracy/Desktop/practice/project1/test_ver2.csv",sep=",")  #93.9MB

train_df <- kaggle_train[sample(nrow(kaggle_train),47309),]

# edit row name
# Employee index: A active, B ex employed, F filial, N not employee, P pasive
# Customer type at the beginning of the month ,1 (First/Primary customer), 2 (co-owner ),P (Potential),3 (former primary), 4(former co-owner)
# Customer relation type at the beginning of the month, A (active), I (inactive), P (former customer),R (Potential)
# Residence index (S (Yes) or N (No) if the residence country is the same than the bank country)
# Foreigner index (S (Yes) or N (No) if the customer's birth country is different than the bank country)
# Activity index (1, active customer; 0, inactive customer)
colnames(kaggle_test) <- c("Date","Customer code","Employee index","Customer's Country residence","Customer's sex","Age","Contract_start_date",
                           "New customer Index","Customer seniority (in months)","1 (First/Primary), 99 (new Primary customer)","Last date as primary customer",
                           "Customer type","Customer relation type","Residence index","Foreigner index","Spouse index","channel used by the customer to join",
                           "Deceased index. N/S","Addres type","Province code (customer's address)","Province name","Activity index","Gross_income","segmentation")



names(train_df) <- c("Date","Customer code","Employee index","Customer's Country residence","Customer's sex","Age","Contract_start_date",
                        "New customer Index","Customer seniority (in months)","1 (First/Primary), 99 (new Primary customer)","Last date as primary customer",
                        "Customer type","Customer relation type","Residence index","Foreigner index","Spouse index","channel used by the customer to join",
                        "Deceased index. N/S","Addres type","Province code (customer's address)","Province name","Activity index","Gross_income",
                        "segmentation","Saving Account","Guarantees","Current Accounts","Derivada Account",
                     "Payroll Account","Junior Account","Más particular Account","particular Account","particular Plus Account","Short-term deposits","Medium-term deposits",
                     "Long-term deposits","e-account","Funds","Mortgage","Pensions_2","Loans","Taxes","Credit Card","Securities","Home Account",
                     "Payroll","Pensions","Direct Debit")


train_df$Distance <- sample(1:100, 47309,replace = TRUE)
train_df$Quantity <- sample(0:4, 47309,replace = TRUE)
train_df$Price <- sample(1:200, 47309,replace = TRUE)

kaggle_test$Distance <- sample(1:100, 929615,replace = TRUE)
kaggle_test$Price <- sample(1:200, 929615,replace = TRUE)

# set up scale of likelihood for consumers to purchase product: 0-10, eg:quantity 0-20 has scale 0-2, possible effects: quantity, income, price, distance

# problem: the dependent var should be scale, but this var is not given and we need to predict in for every independent var such as quantity

# logic: use training dataset to calculate probablity/likelihood. eg, for each consumer, 
# using the give distance and quantity in the training dataset, to calculte the probability.
# method: convert quantity to probability 0-1. 
# Then apply it to test dataset (quantity and distance are given) and predict the probability.
# note: set up range for distance in regression tree

# i was thinking to combine logistic regression and regression tree together, but it is not 
# very useful to see indivisual variable, bc cannot help me make decision after comparing each variable

# OR i think random forest is the best method in this case, if we only want to get one likelihood
# after consider every possibility for each independent variable. 

train_df$quantity_to_binary <- ifelse(train_df$Quantity==0, 0,1)
train_df$quantity_to_binary <- as.factor(train_df$quantity_to_binary)
table(train_df$quantity_to_binary)
table(train_df$quantity_to_binary)/nrow(train_df)


# delete extra cols : "Más particular Account","particular Account","particular Plus Account","Short-term deposits","Medium-term deposits","Long-term deposits","e-account","Funds","Mortgage","Pensions_2","Loans","Taxes","Credit Card","Securities","Home Account","Payroll","Pensions","Direct Debit"
new_train_df <- train_df[,-c(25:48)]

# remove missing data
new_train_df <- na.omit(new_train_df)
new_test_df <- na.omit(kaggle_test)


# remove non-useful cols
new_train_df <-subset(new_train_df, select = -c(`Province code (customer's address)`,`Date`))
new_train_df <-subset(new_train_df, select = -c(`Customer's Country residence`, `Customer code`))
new_train_df <-subset(new_train_df, select = -c(`Contract_start_date`, `Quantity`))
new_train_df <-subset(new_train_df, select = -c(`channel used by the customer to join`,`Province name`))
new_train_df <-subset(new_train_df, select = -c(`Spouse index`,`Last date as primary customer`))
new_test_df <-subset(new_test_df, select = -c(`Province code (customer's address)`,`Date`))
new_test_df <-subset(new_test_df, select = -c(`Customer's Country residence`, `Customer code`))
new_test_df <-subset(new_test_df, select = -c(`Contract_start_date`, `channel used by the customer to join`))
new_test_df <-subset(new_test_df, select = -c(`Province name`,`Spouse index`))
new_test_df <-subset(new_test_df, select = -c(`Last date as primary customer`))

# transfer data type
new_train_df$`Customer's sex` <- as.factor(new_train_df$`Customer's sex`)
new_train_df$`Employee index` <-as.factor(new_train_df$`Employee index`)
new_train_df$Age <-as.numeric(new_train_df$Age)
new_train_df$`New customer Index` <-as.factor(new_train_df$`New customer Index`)
new_train_df$`Customer seniority (in months)` <-as.numeric(new_train_df$`Customer seniority (in months)`)
new_train_df$`1 (First/Primary), 99 (new Primary customer)` <-as.factor(new_train_df$`1 (First/Primary), 99 (new Primary customer)`)
new_train_df$`Customer type` <- as.factor(new_train_df$`Customer type`)
new_train_df$`Customer relation type` <- as.factor(new_train_df$`Customer relation type`)
new_train_df$`Residence index` <- as.factor(new_train_df$`Residence index`)
new_train_df$`Foreigner index` <- as.factor(new_train_df$`Foreigner index`)
new_train_df$`Deceased index. N/S` <- as.factor(new_train_df$`Deceased index. N/S`)
new_train_df$`Addres type` <- as.factor(new_train_df$`Addres type`)
new_train_df$`Activity index` <- as.factor(new_train_df$`Activity index`)
new_train_df$Gross_income <- as.numeric(new_train_df$Gross_income)
new_train_df$`segmentation` <- as.factor(new_train_df$`segmentation`)
new_train_df$Distance <- as.numeric(new_train_df$Distance)
new_train_df$Price <- as.numeric(new_train_df$Price)
new_train_df$`Employee index` <- as.factor(new_train_df$`Employee index`)

Distance <- new_train_df$Distance
sex<- new_train_df$`Customer's sex` 
employee_index <- new_train_df$`Employee index`
customer_index <- new_train_df$`New customer Index`
seniority <- new_train_df$`Customer seniority (in months)`
class <- new_train_df$`1 (First/Primary), 99 (new Primary customer)`
type <- new_train_df$`Customer type`
residence_index <- new_train_df$`Residence index`
foreiner_index <- new_train_df$`Foreigner index`
decreased_index <- new_train_df$`Deceased index. N/S`
addres_type <- new_train_df$`Addres type`
activity_index <- new_train_df$`Activity index`
income<- new_train_df$Gross_income


rf <-randomForest(quantity_to_binary~Distance+Price+segmentation+seniority+activity_index+decreased_index
                  +customer_index+Age+type+class+sex+foreiner_index +income
                  +employee_index+addres_type+residence_index
                 , data=new_train_df, importance=TRUE)
round(importance(rf),2)

new_test_df2 <- new_test_df[sample(nrow(new_test_df),nrow(new_train_df)),]

predic <- predict(rf, new_test_df2, na.action=na.omit,type='prob')

par(mar=c(1,1,1,1))
# mean decrease in node impurity/ importance
varImpPlot(rf,type = 2)


# multiple the probability into scale by 10, ie, prob=0.2, scale=0.2*10=2
scale <- predic[,2]*10

# boxplot with y-axi=prob, x-axis= count the number of same probability/scale
t<-table(scale)
t_df <- as.data.frame(t)
t_df$scale <- as.vector(t_df$scale)
count<-as.vector(t_df$Freq)
scale2<-as.numeric(t_df$scale)

boxplot(scale2~count)
par(mfrow=c(3,1))
plot(t,main='histogram')
boxplot(scale2,main='boxplot of total scale')
boxplot(scale2~count, main='boxplot of individual scale', outlier=FALSE)

# count2 <- count[1:69]
# new_t_df <- t_df[c(1:69),]
# new_t_df$scale <- as.vector(new_t_df$scale)
# count<-as.vector(new_t_df$Freq)
# scale3<-as.numeric(new_t_df$scale)
# boxplot(scale3~count2, main='boxplot of individual scale', outlier=FALSE)

quantile(count)
quantile(scale2)
quantile(scale)

train <- write.csv(new_train_df, '/Users/tracy/Desktop/practice/project1/train.csv')
test<- write.csv(new_test_df2, '/Users/tracy/Desktop/practice/project1/test.csv')
test <- write.csv(new_test_df2, '/Users/tracy/Desktop/practice/project1/test.csv')